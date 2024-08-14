import express from 'express';
import {
  createClient,
  updateClient,
  listClients,
  getClientDetail,
  deleteClient
} from '../controllers/client.controller.js';

const router = express.Router();


router.post('/', createClient);
router.put('/:id', updateClient);
router.get('/', listClients);
router.get('/:id', getClientDetail);
router.delete('/:id', deleteClient);

export default router;
