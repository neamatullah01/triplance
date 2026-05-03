import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma"; // there's a prisma.ts in src/lib

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL as string,
  trustedOrigins: [
    process.env.FRONTEND_URL as string,
    "https://triplanceworld.vercel.app",
    "http://localhost:3000",
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  // Expose additional User fields (e.g. role) in the session/get-session response
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "TRAVELER",
        input: false, // Do not allow the client to set this directly
      },
      isVerified: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      partitioned: true,
    },
  },
});
