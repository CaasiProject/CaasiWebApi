import express from 'express';
import { createAbsence, updateAbsence, listAbsences, getAbsenceDetail, deleteAbsence } from '../controllers/absence.controller.js';

const router = express.Router();

router.post('/', createAbsence);
router.patch('/:id', updateAbsence);
router.get('/', listAbsences);
router.get('/:id', getAbsenceDetail);
router.delete('/:id', deleteAbsence);

export default router;
