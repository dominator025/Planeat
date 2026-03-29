const express = require('express');
const auth = require('../middleware/auth');
const { allAsync } = require('../db/schema');

const router = express.Router();

router.get('/summary', auth, async (req, res) => {
    try {
        // Mock summary from historical records
        // Get the latest 30 days
        const records = await allAsync('SELECT * FROM waste_records ORDER BY id DESC LIMIT 30');
        
        let totalWasteSaved = 0;
        let totalCostSaved = 0;
        
        // Summing up for a mock presentation
        records.forEach(r => {
            totalWasteSaved += r.total_waste;
            totalCostSaved += r.waste_cost;
        });

        // Today's specific impact
        let wasteSavedToday = 0;
        let revenueImpact = 0;
        
        if (records.length > 0) {
            const today = records[0].total_waste;
            const previousAvg = 50; // hardcoded baseline
            wasteSavedToday = Math.max(0, previousAvg - today);
            revenueImpact = wasteSavedToday * 2.5;
        }

        res.json({
            wasteSavedToday: wasteSavedToday.toFixed(1),
            revenueImpact: revenueImpact.toFixed(2),
            totalWasteSaved: totalWasteSaved.toFixed(0),
            totalCostSaved: totalCostSaved.toFixed(0),
        });

    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.get('/trend', auth, async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 7;
        const records = await allAsync('SELECT date, total_waste, total_consumed FROM waste_records ORDER BY id DESC LIMIT ?', [days]);
        res.json(records.reverse());
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
