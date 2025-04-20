import express from 'express';
import TopicController from '../controllers/TopicController.js';

const router = express.Router();

router.get('/getalltopic', TopicController.GetAll);
router.get('/getalltag', TopicController.GetAllTag);
router.get('/gettopicrecommend', TopicController.GetRecommendTopic);
router.get('/search', TopicController.Search);

export default router;