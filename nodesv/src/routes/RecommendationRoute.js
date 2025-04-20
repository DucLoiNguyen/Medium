import express from 'express';
import RecommendationController from '../controllers/RecommendationController.js';

const router = express.Router();

router.get('/recommendations', RecommendationController.GetRecommendationsPosts);
router.get('/recommendations/:type', RecommendationController.GetRecommendationsPostByType);
router.get('/users', RecommendationController.getUserRecommendation);

export default router;