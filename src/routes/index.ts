import express from 'express';
import validator from '../helpers/validator';
import { signupSchema } from '../schema';
import { signupController } from '../controller/authController';
const router = express.Router();

//router common
router.post('/signup', validator(signupSchema), signupController);

export default router;
