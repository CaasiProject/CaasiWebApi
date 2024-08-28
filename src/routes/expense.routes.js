import express from 'express';
import { createExpense, getExpenseDetails, getExpenses, updateExpense, deleteExpense,updateExpenseStatus, getUserExpenseDetails } from '../controllers/expense.controller.js';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Expense
 *     description: Expense management operations
 */

/**
 * @openapi
 * /expense/expenses:
 *   post:
 *     tags: [Expense]
 *     summary: Create a new expense
 *     description: Creates a new expense entry.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 100.00
 *               category:
 *                 type: string
 *                 example: Travel
 *               description:
 *                 type: string
 *                 example: Business trip to New York
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2024-08-15
 *     responses:
 *       201:
 *         description: Expense created successfully
 *       400:
 *         description: Bad Request
 */
router.post('/create', createExpense);

/**
 * @openapi
 * /expense/expenses:
 *   get:
 *     tags: [Expense]
 *     summary: Get all expenses
 *     description: Retrieves a list of all expenses with optional filters.
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by expense category
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date
 *     responses:
 *       200:
 *         description: Expenses retrieved successfully
 */
router.get('/list', getExpenses);

/**
 * @openapi
 * /expense/expenses/{id}:
 *   get:
 *     tags: [Expense]
 *     summary: Get expense details by ID
 *     description: Retrieves details of an expense by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Expense ID
 *     responses:
 *       200:
 *         description: Expense details retrieved successfully
 *       404:
 *         description: Expense not found
 */
router.get('/:id/datail', getExpenseDetails);

/**
 * @openapi
 * /expense/expenses/{id}:
 *   patch:
 *     tags: [Expense]
 *     summary: Update expense details by ID
 *     description: Updates details of an expense by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Expense ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 120.00
 *               category:
 *                 type: string
 *                 example: Meals
 *               description:
 *                 type: string
 *                 example: Business dinner
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2024-08-16
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *       404:
 *         description: Expense not found
 */
router.patch('/update/:id', updateExpense);

/**
 * @openapi
 * /expense/expenses/{id}:
 *   delete:
 *     tags: [Expense]
 *     summary: Delete expense by ID
 *     description: Deletes an expense by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Expense ID
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 *       404:
 *         description: Expense not found
 */
router.delete('/expenses/:id', deleteExpense);

router.post('/:id/status', updateExpenseStatus);

router.get('/:id/useriddatail', getUserExpenseDetails);
export default router;
