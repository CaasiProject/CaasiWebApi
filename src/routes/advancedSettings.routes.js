import express from 'express';
import {
  createAdvancedSettings,
  updateAdvancedSettings,
  listAdvancedSettings,
  getAdvancedSettingsDetail,
  deleteAdvancedSettings
} from '../controllers/advancedSettings.controller.js';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Advanced Settings
 *     description: Operations related to advanced settings
 */

/**
 * @openapi
 * /advanced-settings:
 *   post:
 *     tags: [Advanced Settings]
 *     summary: Create new advanced settings
 *     description: Creates a new entry in the advanced settings.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               settingName:
 *                 type: string
 *                 example: "MaxUsers"
 *               settingValue:
 *                 type: string
 *                 example: "100"
 *     responses:
 *       201:
 *         description: Advanced settings created successfully
 *       400:
 *         description: Bad Request
 */
router.post('/', createAdvancedSettings);

/**
 * @openapi
 * /advanced-settings/{id}:
 *   patch:
 *     tags: [Advanced Settings]
 *     summary: Update advanced settings by ID
 *     description: Updates the advanced settings entry by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the advanced settings to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               settingName:
 *                 type: string
 *                 example: "MaxUsers"
 *               settingValue:
 *                 type: string
 *                 example: "150"
 *     responses:
 *       200:
 *         description: Advanced settings updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Advanced settings not found
 */
router.patch('/:id', updateAdvancedSettings);

/**
 * @openapi
 * /advanced-settings:
 *   get:
 *     tags: [Advanced Settings]
 *     summary: List all advanced settings
 *     description: Retrieves a list of all advanced settings.
 *     responses:
 *       200:
 *         description: Advanced settings retrieved successfully
 */
router.get('/', listAdvancedSettings);

/**
 * @openapi
 * /advanced-settings/{id}:
 *   get:
 *     tags: [Advanced Settings]
 *     summary: Get advanced settings by ID
 *     description: Retrieves the advanced settings entry by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the advanced settings to retrieve
 *     responses:
 *       200:
 *         description: Advanced settings retrieved successfully
 *       404:
 *         description: Advanced settings not found
 */
router.get('/:id', getAdvancedSettingsDetail);

/**
 * @openapi
 * /advanced-settings/{id}:
 *   delete:
 *     tags: [Advanced Settings]
 *     summary: Delete advanced settings by ID
 *     description: Deletes the advanced settings entry by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the advanced settings to delete
 *     responses:
 *       200:
 *         description: Advanced settings deleted successfully
 *       404:
 *         description: Advanced settings not found
 */
router.delete('/:id', deleteAdvancedSettings);

export default router;
