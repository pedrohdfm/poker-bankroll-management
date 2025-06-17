import express from 'express';
import { 
  createTournament, 
  getTournaments, 
  getStats 
} from '../controllers/TournamentController.js';
import { requireAuth } from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.use(requireAuth);

router.post('/', createTournament);
router.get('/', getTournaments);
router.get('/stats', getStats);

export default router;