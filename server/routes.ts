
import express from 'express';
import { readData, writeData } from './db';

const router = express.Router();

// Get all data
router.get('/data', (req, res) => {
    const data = readData();
    res.json(data);
});

// Update all data (Admin)
router.post('/admin/save', (req, res) => {
    const newData = req.body;
    if (!newData || !newData.categories || !newData.objectives) {
        return res.status(400).json({ error: 'Invalid data format' });
    }
    if (writeData(newData)) {
        res.json({ success: true, message: 'Data saved successfully' });
    } else {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

export default router;
