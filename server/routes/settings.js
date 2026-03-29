const express = require('express');
const auth = require('../middleware/auth');
const { getAsync, runAsync } = require('../db/schema');

const router = express.Router();

// Get settings for the authenticated institution
router.get('/', auth, async (req, res) => {
    try {
        const user = await getAsync('SELECT name, email, institution, institution_type, institution_size, sms_alerts, overproduction_alerts FROM users WHERE id = ?', [req.user.id]);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update settings
router.post('/', auth, async (req, res) => {
    try {
        const { institution, institution_type, institution_size, sms_alerts, overproduction_alerts } = req.body;
        
        await runAsync(
            `UPDATE users SET institution = ?, institution_type = ?, institution_size = ?, sms_alerts = ?, overproduction_alerts = ? WHERE id = ?`,
            [institution, institution_type, institution_size, sms_alerts ? 1 : 0, overproduction_alerts ? 1 : 0, req.user.id]
        );
        
        const updatedUser = await getAsync('SELECT name, email, institution, institution_type, institution_size, sms_alerts, overproduction_alerts FROM users WHERE id = ?', [req.user.id]);
        res.json(updatedUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Reset data helper
router.post('/reset', auth, async (req, res) => {
    try {
        await runAsync('DELETE FROM waste_records');
        await runAsync('DELETE FROM daily_menu');
        await runAsync('DELETE FROM predictions');
        res.json({ msg: 'All tracking data reset successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
