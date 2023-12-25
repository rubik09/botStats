interface CustomError extends Error {
    status?: number;
}

function throwError(errorMessage: string, statusCode: number): never {
    const err: CustomError = new Error(errorMessage);
    err.status = statusCode;
    throw err;
}

export default throwError;
