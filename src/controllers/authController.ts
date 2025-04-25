import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import User from './../models/User';
import config from '../config/config';

export const register = async (req: Request, res: Response): Promise<any> => {
    const { email, password }: { email: string, password: string } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(config.http_status_ok).json({
                status: config.status_fail,
                message: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, config.bcrypt_salt_round);

        await User.create({ email, password: hashedPassword });

        res.status(config.http_status_ok).json({
            status: config.status_success,
            message: 'User registered successfully'
        });
    } catch (error) {
        res.status(config.http_status_ok).json({
            status: config.status_fail,
            message: "Uh-oh! Something went wrong. Please try again later."
        });
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
    const { email, password }: { email: string, password: string } = req.body;
    try {
        const user = await User.findOne({ email }).lean();
        if (!user) {
            return res.status(config.http_status_ok).json({
                status: config.status_fail,
                message: 'Invalid credentials'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(config.http_status_ok).json({
                status: config.status_fail,
                message: 'Invalid credentials'
            });
        }
        const payload = { id: user._id.toString() };
        const secret: Secret = config.jwt_encryption;
        const options: SignOptions = { expiresIn: config.jwt_expiration as SignOptions['expiresIn'] };

        const token = jwt.sign(payload, secret, options);

        const userWithoutPassword = { ...user } as { [key: string]: any };
        delete userWithoutPassword.password;

        res.status(config.http_status_ok).json({
            status: config.status_success,
            data: {
                user: userWithoutPassword,
                token
            }
        });
    } catch (err) {
        res.status(config.http_status_ok).json({
            status: config.status_fail,
            message: "Uh-oh! Something went wrong. Please try again later."
        });
    }
};
