import express from 'express';
import { createActivity, updateActivity, listActivities, getActivityDetail, deleteActivity } from '../controllers/activity.controller.js';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Activity
 *     description: Operations related to activities
 */

/**
 * @openapi
 * /activities:
 *   post:
 *     tags: [Activity]
 *     summary: Create a new activity
 *     description: Creates a new activity entry.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activityName:
 *                 type: string
 *                 example: "User Registration"
 *               description:
 *                 type: string
 *                 example: "Activity when a new user registers"
 *     responses:
 *       201:
 *         description: Activity created successfully
 *       400:
 *         description: Bad Request
 */
router.post('/', createActivity);

/**
 * @openapi
 * /activities/{id}:
 *   patch:
 *     tags: [Activity]
 *     summary: Update activity by ID
 *     description: Updates the activity entry by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the activity to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activityName:
 *                 type: string
 *                 example: "User Login"
 *               description:
 *                 type: string
 *                 example: "Activity when a user logs in"
 *     responses:
 *       200:
 *         description: Activity updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Activity not found
 */
router.patch('/:id', updateActivity);

/**
 * @openapi
 * /activities:
 *   get:
 *     tags: [Activity]
 *     summary: List all activities
 *     description: Retrieves a list of all activities.
 *     responses:
 *       200:
 *         description: List of activities
 *       500:
 *         description: Internal Server Error
 */
router.get('/', listActivities);

/**
 * @openapi
 * /activities/{id}:
 *   get:
 *     tags: [Activity]
 *     summary: Get activity by ID
 *     description: Retrieves a specific activity by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the activity to retrieve
 *     responses:
 *       200:
 *         description: Activity details
 *       404:
 *         description: Activity not found
 */
router.get('/:id', getActivityDetail);

/**
 * @openapi
 * /activities/{id}:
 *   delete:
 *     tags: [Activity]
 *     summary: Delete activity by ID
 *     description: Deletes the activity entry by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the activity to delete
 *     responses:
 *       200:
 *         description: Activity deleted successfully
 *       404:
 *         description: Activity not found
 */
router.delete('/:id', deleteActivity);

export default router;
