import express,{ Router } from 'express';
import controller from '../controllers/sellerController';

const router = express.Router();

router.get('/transactions-summary',controller.getSummaryTransaction);
router.post('/',controller.AddSeller);

export = router;