const express = require('express');
const auth = require('../middleware/auth');
const { getAsync, runAsync, allAsync } = require('../db/schema');

const router = express.Router();

router.get('/items', auth, async (req, res) => {
    try {
        const items = await allAsync('SELECT * FROM menu_items');
        res.json(items);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.post('/items', auth, async (req, res) => {
    try {
         const { name, category, base_quantity, unit, cost_per_unit } = req.body;
         const result = await runAsync(
            `INSERT INTO menu_items (name, category, base_quantity, unit, cost_per_unit) VALUES (?, ?, ?, ?, ?)`,
            [name, category, base_quantity, unit, cost_per_unit]
         );
         res.json({ id: result.lastID, name, category, base_quantity, unit, cost_per_unit });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.get('/daily/:date', auth, async (req, res) => {
    try {
        const { date } = req.params;
        const dailyItems = await allAsync(`
            SELECT d.id as daily_id, d.suggested_qty, d.actual_qty, d.status, m.*
            FROM daily_menu d
            JOIN menu_items m ON d.menu_item_id = m.id
            WHERE d.date = ?
        `, [date]);
        res.json(dailyItems);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.post('/daily', auth, async (req, res) => {
    try {
        const { date, items } = req.body;
        
        // Delete existing for this date to perform a fresh upsert
        await runAsync(`DELETE FROM daily_menu WHERE date = ?`, [date]);
        
        for (const item of items) {
           await runAsync(
               `INSERT INTO daily_menu (date, menu_item_id, suggested_qty, actual_qty, status) VALUES (?, ?, ?, ?, ?)`,
               [date, item.id, item.suggested, item.actual, item.status]
           );
        }
        res.json({ message: "Menu plan saved successfully" });
    } catch (err) {
         res.status(500).send('Server error');
    }
});

// Update item quantities based on staff edits
router.put('/daily/:id', auth, async (req, res) => {
    try {
        const { actual_qty } = req.body;
        await runAsync(`UPDATE daily_menu SET actual_qty = ?, status = 'staff_modified' WHERE id = ?`, [actual_qty, req.params.id]);
        res.json({ message: "Item updated" });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
