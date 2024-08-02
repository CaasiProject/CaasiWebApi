import express from 'express';
import { createAdvancedSettings, updateAdvancedSettings, listAdvancedSettings, getAdvancedSettingsDetail, deleteAdvancedSettings } from '../controllers/advancedSettings.controller.js';

const router = express.Router();


router.post('/', createAdvancedSettings);
router.patch('/:id', updateAdvancedSettings);
router.get('/', listAdvancedSettings);
router.get('/:id', getAdvancedSettingsDetail);
router.delete('/:id', deleteAdvancedSettings);

export default router;
