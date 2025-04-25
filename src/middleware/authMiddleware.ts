import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config/config';
import User from '../models/User';
import { Types } from 'mongoose';

type reqUser = {
    _id: Types.ObjectId,
    email: String,
    password: String,
}

interface AuthenticatedRequest extends Request {
    user?: reqUser;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(config.http_status_auth_fail).json({
            status: config.status_fail,
            message: 'No token provided'
        });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded: string | JwtPayload = jwt.verify(token, config.jwt_encryption);
        if (typeof decoded === 'string' || !('id' in decoded)) {
            return res.status(config.http_status_auth_fail).json({
                status: config.status_fail,
                message: 'Invalid token'
            });
        }
        const getUser = await User.findById(decoded.id);
        if (!getUser) {
            return res.status(config.http_status_auth_fail).json({
                status: config.status_fail,
                message: 'Invalid token'
            });
        }
        req.user = getUser;
        next();
    } catch (error) {
        return res.status(config.http_status_auth_fail).json({
            status: config.status_fail,
            message: 'Invalid token'
        });
    }
};
