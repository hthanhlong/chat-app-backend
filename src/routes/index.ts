import express from 'express';
import validator from '../helpers/validator';
import { loginSchema, signupSchema } from '../schema';
import {
  signupController,
  loginController,
} from '../controller/authController';
import asyncHandler from '../helpers/asyncHandler';
const router = express.Router();

//router common
router.post('/signup', validator(signupSchema), asyncHandler(signupController));
router.post('/login', validator(loginSchema), asyncHandler(loginController));

export default router;
