import express from 'express';
import { createAbsence, updateAbsence, listAbsences, getAbsenceDetail, deleteAbsence } from '../controllers/absence.controller.js';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Absence
 *     description: Operations related to absences
 */

/**
 * @openapi
 * /absences:
 *   post:
 *     tags: [Absence]
 *     summary: Create a new absence
 *     description: Creates a new absence entry.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: string
 *                 example: "60d5ec49f1b2c72b1f9b3b9b"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-08-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-08-10"
 *               reason:
 *                 type: string
 *                 example: "Vacation"
 *     responses:
 *       201:
 *         description: Absence created successfully
 *       400:
 *         description: Bad Request
 */
router.post('/create', createAbsence);

/**
 * @openapi
 * /absences/{id}:
 *   patch:
 *     tags: [Absence]
 *     summary: Update absence by ID
 *     description: Updates the absence entry by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the absence to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-08-02"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-08-12"
 *               reason:
 *                 type: string
 *                 example: "Medical Leave"
 *     responses:
 *       200:
 *         description: Absence updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Absence not found
 */
router.patch('/:id/update', updateAbsence);

/**
 * @openapi
 * /absences:
 *   get:
 *     tags: [Absence]
 *     summary: List all absences
 *     description: Retrieves a list of all absences.
 *     responses:
 *       200:
 *         description: List of absences
 *       500:
 *         description: Internal Server Error
 */
router.get('/list', listAbsences);

/**
 * @openapi
 * /absences/{id}:
 *   get:
 *     tags: [Absence]
 *     summary: Get absence by ID
 *     description: Retrieves a specific absence by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the absence to retrieve
 *     responses:
 *       200:
 *         description: Absence details
 *       404:
 *         description: Absence not found
 */
router.get('/:id/detail', getAbsenceDetail);

/**
 * @openapi
 * /absences/{id}:
 *   delete:
 *     tags: [Absence]
 *     summary: Delete absence by ID
 *     description: Deletes the absence entry by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the absence to delete
 *     responses:
 *       200:
 *         description: Absence deleted successfully
 *       404:
 *         description: Absence not found
 */
router.delete('/:id/delete', deleteAbsence);

export default router;
