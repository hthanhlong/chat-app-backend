export enum ErrorType {
  BAD_TOKEN = 'BadTokenError',
  TOKEN_EXPIRED = 'TokenExpiredError',
  UNAUTHORIZED = 'AuthFailureError',
  ACCESS_TOKEN = 'AccessTokenError',
  INTERNAL = 'InternalError',
  NOT_FOUND = 'NotFoundError',
  NO_ENTRY = 'NoEntryError',
  NO_DATA = 'NoDataError',
  BAD_REQUEST = 'BadRequestError',
  FORBIDDEN = 'ForbiddenError',
}

export abstract class ApiError extends Error {
  constructor(
    public status: number,
    public type: ErrorType,
    public message: string = 'error',
  ) {
    super(type);
  }
}

export class AuthFailureError extends ApiError {
  constructor(message = 'Invalid Credentials') {
    super(400, ErrorType.UNAUTHORIZED, message);
  }
}

export class InternalError extends ApiError {
  constructor(message = 'Internal error') {
    super(400, ErrorType.INTERNAL, message);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request') {
    super(400, ErrorType.BAD_REQUEST, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not Found') {
    super(400, ErrorType.NOT_FOUND, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Permission denied') {
    super(400, ErrorType.FORBIDDEN, message);
  }
}

export class NoEntryError extends ApiError {
  constructor(message = "Entry don't exists") {
    super(400, ErrorType.NO_ENTRY, message);
  }
}

export class BadTokenError extends ApiError {
  constructor(message = 'Token is not valid') {
    super(401, ErrorType.BAD_TOKEN, message);
  }
}

export class TokenExpiredError extends ApiError {
  constructor(message = 'jwt expired') {
    super(401, ErrorType.TOKEN_EXPIRED, message);
  }
}

export class NoDataError extends ApiError {
  constructor(message = 'No data available') {
    super(400, ErrorType.NO_DATA, message);
  }
}

export class AccessTokenError extends ApiError {
  constructor(message = 'Invalid access token') {
    super(400, ErrorType.ACCESS_TOKEN, message);
  }
}
