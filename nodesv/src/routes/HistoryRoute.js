import express from 'express';
import HistoryController from '../controllers/HistoryController.js';

const router = express.Router();

router.post('/track', HistoryController.TrackReading);
router.get('/', HistoryController.GetReadingHistory);
router.delete('/:id', HistoryController.RemoveFromHistory);
router.delete('/', HistoryController.clearHistory);

export default router;