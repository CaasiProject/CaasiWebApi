import express from 'express';
import { createExpense, getExpenseDetails, getExpenses, updateExpense, deleteExpense } from '../controllers/expense.controller.js';

const router = express.Router();

router.post('/expenses', createExpense);
router.get('/expenses', getExpenses);
router.get('/expenses/:id', getExpenseDetails);
router.patch('/expenses/:id', updateExpense);
router.delete('/expenses/:id', deleteExpense);

export default router;
