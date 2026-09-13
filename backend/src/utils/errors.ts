/** Base class for all expected application errors. */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

/** Represents invalid request data. */
export class BadRequestError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, details);
  }
}

/** Represents invalid or missing authentication. */
export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401);
  }
}

/** Represents an authenticated user without permission. */
export class ForbiddenError extends AppError {
  constructor(message = "Access forbidden") {
    super(message, 403);
  }
}

/** Represents a missing resource. */
export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

/** Represents a duplicate resource. */
export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409);
  }
}

/** Represents a valid request that violates a business rule. */
export class UnprocessableEntityError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 422, details);
  }
}

/**
 * Validation-specific bad request with structured details.
 * Use BadRequestError for general invalid requests.
 */
export class ValidationError extends BadRequestError {
  constructor(message: string, details?: unknown) {
    super(message, details);
    this.name = "ValidationError";
  }
}