const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// GET /api/grammar/language/:lang - Get grammar content for a language
router.get('/language/:lang', async (req, res) => {
    try {
        const { lang } = req.params;
        const course = await Course.findOne({ language: lang });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Extract grammar from all units
        const grammarLessons = course.units
            .filter(unit => unit.grammar && unit.grammar.length > 0)
            .map(unit => ({
                unitId: unit.unitId,
                unitTitle: unit.title,
                grammar: unit.grammar
            }));

        res.json(grammarLessons);
    } catch (err) {
        console.error('Grammar fetch error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/grammar/unit/:unitId - Get grammar for specific unit
router.get('/unit/:unitId', async (req, res) => {
    try {
        const { unitId } = req.params;
        const { lang } = req.query;

        const course = await Course.findOne({ language: lang || 'Hindi' });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const unit = course.units.find(u => u.unitId === Number(unitId));
        if (!unit || !unit.grammar) {
            return res.status(404).json({ error: 'Grammar content not found' });
        }

        res.json({
            unitId: unit.unitId,
            unitTitle: unit.title,
            grammar: unit.grammar
        });
    } catch (err) {
        console.error('Grammar fetch error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
