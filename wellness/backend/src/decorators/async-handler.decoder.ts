import { Request, Response, NextFunction } from "express";

export function AsyncHandler() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      try {
        await originalMethod.call(this, req, res, next);
      } catch (error: any) {
        next(error);
      }
    };
    return descriptor;
  };
}