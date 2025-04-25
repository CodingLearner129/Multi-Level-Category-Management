import { Request, Response, NextFunction } from 'express';
import { Validator } from 'node-input-validator';
import config from '../config/config';

export const validate = (rules: Record<string, string>): any => {
    return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const validator = new Validator(req.body, rules);

            const matched = await validator.check();
            if (!matched) {
                let firstErrorField = Object.keys(validator.errors)[0]; // Get the first error field name
                let firstErrorMessage = validator.errors[firstErrorField]['message']; // Get the first error message
                return res.status(config.http_status_ok).json({
                    status: config.status_fail,
                    message: firstErrorMessage
                });
            }

            next();
        } catch (error) {
            return res.status(config.http_status_ok).json({
                status: config.status_fail,
                message: "Uh-oh! Something went wrong. Please try again later.",
            });
        }
    };
};
