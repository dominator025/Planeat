const express = require('express');
const cors = require('cors');
const { initDb } = require('./db/schema');

const app = express();

// Initialize DB and Seed Data
initDb()
  .then(() => console.log("Database initialized and seeded successfully."))
  .catch(err => console.error("Database initialization failed:", err));

// Middleware
app.use(express.json({ extended: false }));
app.use(cors());

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/predict', require('./routes/predict'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/settings', require('./routes/settings'));

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;
