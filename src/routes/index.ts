import express from 'express';
import validator from '../helpers/validator';
import { signupSchema } from '../schema';
import { signupController } from '../controller/authController';
import asyncHandler from '../helpers/asyncHandler';
const router = express.Router();

//router common
router.post('/signup', validator(signupSchema), asyncHandler(signupController));

export default router;
