import { Prisma } from "../../generated/prisma/client";
import { TErrorSources, TGenericErrorResponse } from "./error.interface";

const handlePrismaValidationError = (
  err: Prisma.PrismaClientValidationError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: "",
      message: err.message,
    },
  ];

  return {
    statusCode: 400,
    message: "Validation Error",
    errorSources,
  };
};

export default handlePrismaValidationError;
