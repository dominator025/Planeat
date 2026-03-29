const express = require('express');
const auth = require('../middleware/auth');
const { getAsync, runAsync, allAsync } = require('../db/schema');

const router = express.Router();

// Predict Demand
router.post('/', auth, async (req, res) => {
    const { dayOfWeek, weather, event } = req.body;
    
    try {
        // Simple predictive logic based on the user's requirements
        // Predicted Demand = Past Average + Weather Impact + Event Impact
        
        // Let's get "Past Average" from the past 14 days
        const avgQuery = `SELECT AVG(actual_count) as avgCount FROM predictions ORDER BY id DESC LIMIT 14`;
        const result = await getAsync(avgQuery);
        let baseCount = result.avgCount || 800; // default if no history

        // Weather Factor
        let weatherFactor = 1.0;
        if (weather === 'Cloudy') weatherFactor = 0.95;
        if (weather === 'Rainy') weatherFactor = 0.80;
        if (weather === 'Stormy') weatherFactor = 0.60;

        // Event Factor
        let eventFactor = 1.0;
        if (event && event.toLowerCase().includes('exam')) eventFactor = 0.70;
        if (event && event.toLowerCase().includes('festival')) eventFactor = 1.30;
        if (event && event.toLowerCase().includes('holiday')) eventFactor = 0.40;
        if (event && event.toLowerCase().includes('sports')) eventFactor = 1.15;

        const predictedDemand = Math.round(baseCount * weatherFactor * eventFactor);

        const dateStr = new Date().toISOString().split('T')[0];

        // Save prediction
        await runAsync(
            `INSERT INTO predictions (date, day_of_week, weather, event, predicted_count) VALUES (?, ?, ?, ?, ?)`,
            [dateStr, dayOfWeek, weather, event, predictedDemand]
        );

        res.json({
            date: dateStr,
            predicted: predictedDemand,
            factors: { baseCount, weatherFactor, eventFactor }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/latest', auth, async (req, res) => {
    try {
        const latest = await getAsync(`SELECT * FROM predictions ORDER BY date DESC, id DESC LIMIT 1`);
        res.json(latest || { predicted_count: 0 });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/history', auth, async (req, res) => {
    try {
        const history = await allAsync(`SELECT * FROM predictions ORDER BY id DESC LIMIT 7`);
        res.json(history.reverse());
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
