import express from 'express';
import { validate } from '../middleware/validateRequest';
import { loginRules, registerRules } from '../validators/authValidator';
import { login, register } from '../controllers/authController';

const router = express.Router();

router.post('/register', validate(registerRules), register);
router.post('/login', validate(loginRules), login);

export { router };