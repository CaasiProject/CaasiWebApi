import express from 'express';
import { createActivity, updateActivity, listActivities, getActivityDetail, deleteActivity } from '../controllers/activity.controller.js';

const router = express.Router();

router.post('/', createActivity);
router.patch('/:id', updateActivity);
router.get('/', listActivities);
router.get('/:id', getActivityDetail);
router.delete('/:id', deleteActivity);

export default router;
