
import express from 'express';
import { 
  setBankroll, 
  getBankroll
} from '../controllers/BankrollController.js';
import { requireAuth } from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getBankroll);
router.post('/', setBankroll);

export default router;