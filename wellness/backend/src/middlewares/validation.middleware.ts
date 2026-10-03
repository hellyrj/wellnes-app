import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema  } from 'zod';

//the middleware recieve the schema defined in the validation directory as parameter 
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      });
    }
  };
};