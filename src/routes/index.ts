import express from 'express';
import validator from '../helpers/validator';
import { loginSchema, signupSchema } from '../schema';
import {
  signupController,
  loginController,
} from '../controller/authController';
import asyncHandler from '../helpers/asyncHandler';
import { validateToken } from '../core/JWT';
import { getAllUsers } from '../controller/userController';
const router = express.Router();

//router common
router.post('/signup', validator(signupSchema), asyncHandler(signupController));
router.post('/login', validator(loginSchema), asyncHandler(loginController));

//middlewares
router.use(validateToken('ACCESS'));

//router for authentication
router.get('/users', asyncHandler(getAllUsers));

export default router;
