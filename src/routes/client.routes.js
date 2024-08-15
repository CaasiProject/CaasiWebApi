import express from 'express';
import {
  createClient,
  updateClient,
  listClients,
  getClientDetail,
  deleteClient
} from '../controllers/client.controller.js';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Client
 *     description: Client management operations
 */

/**
 * @openapi
 * /clients:
 *   post:
 *     tags: [Client]
 *     summary: Create a new client
 *     description: Creates a new client entry.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: ACME Corp
 *               contactEmail:
 *                 type: string
 *                 example: contact@acme.com
 *               phoneNumber:
 *                 type: string
 *                 example: +123456789
 *               address:
 *                 type: string
 *                 example: 123 Business Rd, City, Country
 *               status:
 *                 type: string
 *                 example: active
 *     responses:
 *       201:
 *         description: Client created successfully
 *       400:
 *         description: Bad Request
 */
router.post('/', createClient);

/**
 * @openapi
 * /clients/{id}:
 *   put:
 *     tags: [Client]
 *     summary: Update client details by ID
 *     description: Updates details of a client by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: ACME Corp
 *               contactEmail:
 *                 type: string
 *                 example: contact@acme.com
 *               phoneNumber:
 *                 type: string
 *                 example: +123456789
 *               address:
 *                 type: string
 *                 example: 123 Business Rd, City, Country
 *               status:
 *                 type: string
 *                 example: inactive
 *     responses:
 *       200:
 *         description: Client updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Client not found
 */
router.put('/:id', updateClient);

/**
 * @openapi
 * /clients:
 *   get:
 *     tags: [Client]
 *     summary: List all clients
 *     description: Retrieves a list of all clients with optional filters.
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by client status
 *     responses:
 *       200:
 *         description: Clients retrieved successfully
 */
router.get('/', listClients);

/**
 * @openapi
 * /clients/{id}:
 *   get:
 *     tags: [Client]
 *     summary: Get client details by ID
 *     description: Retrieves details of a client by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client details retrieved successfully
 *       404:
 *         description: Client not found
 */
router.get('/:id', getClientDetail);

/**
 * @openapi
 * /clients/{id}:
 *   delete:
 *     tags: [Client]
 *     summary: Delete client by ID
 *     description: Deletes a client by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client deleted successfully
 *       404:
 *         description: Client not found
 */
router.delete('/:id', deleteClient);

export default router;
