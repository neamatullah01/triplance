import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";
import { prisma } from "../lib/prisma";
import catchAsync from "../utils/catchAsync";
import { TUserRole } from "../modules/User/user.interface";
import { fromNodeHeaders } from "better-auth/node";
import { auth as betterAuth } from "../lib/auth";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Try Better Auth first (for Google OAuth users)
    const session = await betterAuth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    let userId: string;
    let role: string;

    if (session) {
      userId = session.user.id;
      // We added 'role' as an additionalField in betterAuth config
      role = (session.user as any).role || "TRAVELER";
    } else {
      // 2. Fall back to standard JWT Auth (for email/password users)
      let token = req.cookies?.token || req.headers.authorization;

      if (token && token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
      }

      // checking if the token is missing
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      // checking if the given token is valid
      let decoded;
      try {
        decoded = jwt.verify(
          token,
          config.jwt.access_secret as string,
        ) as JwtPayload;
      } catch (err) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized!");
      }

      userId = decoded.userId;
      role = decoded.role;
    }

    // checking if the user is exist
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
    }

    // checking if the user is banned
    if (user.isBanned) {
      throw new AppError(httpStatus.FORBIDDEN, "This user is banned!");
    }

    if (
      requiredRoles &&
      requiredRoles.length > 0 &&
      !requiredRoles.includes(role as TUserRole)
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    req.user = { userId, role };
    next();
  });
};

export default auth;
