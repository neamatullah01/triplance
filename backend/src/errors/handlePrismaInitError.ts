import { Prisma } from "../../generated/prisma/client";
import { TErrorSources, TGenericErrorResponse } from "./error.interface";

const handlePrismaInitError = (
  err: Prisma.PrismaClientInitializationError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: "",
      message: err.message,
    },
  ];

  return {
    statusCode: 500,
    message: "Database Initialization Error",
    errorSources,
  };
};

export default handlePrismaInitError;
