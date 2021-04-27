import { Router } from 'express';
import products from './products';

const router = Router();

router.use('/products', products);

export default router;
