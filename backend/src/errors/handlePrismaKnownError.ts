import { Prisma } from '@prisma/client';
import { TErrorSources, TGenericErrorResponse } from './error.interface';

const handlePrismaKnownError = (
  err: Prisma.PrismaClientKnownRequestError
): TGenericErrorResponse => {
  let errorSources: TErrorSources = [
    {
      path: '',
      message: err.message,
    },
  ];
  let message = 'Prisma Request Error';
  let statusCode = 400;

  if (err.code === 'P2002') {
    // Unique constraint violation
    const match = err.meta?.target || "Unknown field";
    errorSources = [
      {
        path: Array.isArray(match) ? match.join(', ') : String(match),
        message: 'Duplicate value entered',
      },
    ];
    message = 'Duplicate Entity';
    statusCode = 409;
  } else if (err.code === 'P2025') {
    // Parent not found or element not found
    errorSources = [
      {
        path: '',
        message: err.meta?.cause ? String(err.meta.cause) : 'Record not found!',
      },
    ];
    message = 'Not Found';
    statusCode = 404;
  } else if (err.code === 'P2014') {
    errorSources = [
      {
        path: '',
        message: 'The change you are trying to make would violate the required relation',
      },
    ];
    message = 'Invalid relation violation';
    // 400 Bad Request
    statusCode = 400; 
  }

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handlePrismaKnownError;
