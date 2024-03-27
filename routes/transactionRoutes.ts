import express,{ Router } from 'express';
import controller from '../controllers/transactionController';

const router = express.Router();

router.get('/',controller.getTransactionSeller);
router.post('/',controller.AddTransaction);

export = router;