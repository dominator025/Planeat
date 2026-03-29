const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.VERCEL 
    ? path.join('/tmp', 'planeat.db') 
    : path.join(__dirname, 'planeat.db');
const db = new sqlite3.Database(dbPath);

const initDb = () => {
    db.serialize(() => {
        // Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'staff',
            institution TEXT,
            institution_type TEXT,
            institution_size INTEGER,
            sms_alerts BOOLEAN DEFAULT 1,
            overproduction_alerts BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Menu items
        db.run(`CREATE TABLE IF NOT EXISTS menu_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT,
            base_quantity INTEGER,
            unit TEXT DEFAULT 'kg',
            cost_per_unit REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Daily predictions
        db.run(`CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            day_of_week TEXT,
            weather TEXT,
            event TEXT,
            predicted_count INTEGER,
            actual_count INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Menu daily plan
        db.run(`CREATE TABLE IF NOT EXISTS daily_menu (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            menu_item_id INTEGER,
            suggested_qty REAL,
            actual_qty REAL,
            waste_qty REAL DEFAULT 0,
            status TEXT DEFAULT 'pending',
            FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
        )`);

        // Waste records
        db.run(`CREATE TABLE IF NOT EXISTS waste_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            total_prepared REAL,
            total_consumed REAL,
            total_waste REAL,
            waste_cost REAL,
            co2_saved REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        console.log("Database tables verified/created.");
    });

    // Wait slightly to let db.serialize complete, as sqlite3 handles async poorly inside serialize
    setTimeout(() => seedData(), 1000);
};

const runAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};

const getAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const allAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const bcrypt = require('bcryptjs');

const seedData = async () => {
    try {
        const { count } = await getAsync("SELECT COUNT(*) as count FROM menu_items");
        if (count > 0) return; // Already seeded

        console.log("Seeding database with initial data...");
        
        // Seed admin user
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('password123', salt);
        await runAsync(`INSERT INTO users (name, email, password, role, institution) VALUES (?, ?, ?, ?, ?)`, 
            ['Demo Admin', 'admin@planeat.demo', hash, 'admin', 'Demo University']);

        // Add menu items
        await runAsync(`INSERT INTO menu_items (name, category, base_quantity, unit, cost_per_unit) VALUES 
            ('Steamed Rice', 'Main', 100, 'kg', 1.5),
            ('Chicken Curry', 'Main', 80, 'kg', 5.0),
            ('Mixed Veg Sabzi', 'Main', 60, 'kg', 2.5),
            ('Dal Tadka', 'Side', 50, 'kg', 1.8),
            ('Roti/Chapati', 'Side', 500, 'pcs', 0.1),
            ('Fresh Salad', 'Starter', 20, 'kg', 2.0),
            ('Gulab Jamun', 'Dessert', 200, 'pcs', 0.5)
        `);

        // Seed 90 days of historical data
        const endDate = new Date();
        const baselines = {
            'Monday': 850, 'Tuesday': 870, 'Wednesday': 860,
            'Thursday': 880, 'Friday': 800, 'Saturday': 500, 'Sunday': 450
        };
        const weathers = ['Clear', 'Cloudy', 'Rainy', 'Stormy'];
        const events = ['None', 'Exam', 'Festival', 'Holiday', 'Sports Event'];

        let currentDate = new Date(endDate);
        currentDate.setDate(currentDate.getDate() - 90);

        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'Long' });
            
            const weather = weathers[Math.floor(Math.random() * weathers.length)];
            let event = 'None';
            if (Math.random() > 0.8) event = events[Math.floor(Math.random() * events.length)];

            let predicted = baselines[dayOfWeek] || 800;
            switch(weather) {
                case 'Cloudy': predicted *= 0.95; break;
                case 'Rainy': predicted *= 0.80; break;
                case 'Stormy': predicted *= 0.60; break;
            }
            switch(event) {
                case 'Exam': predicted *= 0.70; break;
                case 'Festival': predicted *= 1.30; break;
                case 'Holiday': predicted *= 0.40; break;
                case 'Sports Event': predicted *= 1.15; break;
            }
            predicted = Math.round(predicted);
            const actual = predicted + Math.floor(Math.random() * 40) - 20;

            await runAsync(
                `INSERT INTO predictions (date, day_of_week, weather, event, predicted_count, actual_count) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [dateStr, dayOfWeek, weather, event, predicted, actual]
            );

            // Waste records
            const prepared = actual * 0.5 + Math.random() * 20; // Example kg
            const consumed = prepared * (0.85 + Math.random() * 0.1); // 85-95% consumed
            const waste = prepared - consumed;
            const wasteCost = waste * 2.5; // Average cost per kg
            const co2 = waste * 2.5; // Average CO2 equivalent

            await runAsync(
                `INSERT INTO waste_records (date, total_prepared, total_consumed, total_waste, waste_cost, co2_saved)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [dateStr, prepared, consumed, waste, wasteCost, co2]
            );

            currentDate.setDate(currentDate.getDate() + 1);
        }
        console.log("Seeding complete.");
    } catch (e) {
        console.error("Error seeding:", e);
    }
};

module.exports = {
    db,
    initDb,
    runAsync,
    getAsync,
    allAsync
};
