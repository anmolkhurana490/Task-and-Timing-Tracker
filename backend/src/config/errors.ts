/** Converts expected authentication failures into HTTP-friendly errors. */
export class AuthError extends Error {
  constructor(message: string, public readonly statusCode: number) {
    super(message);
    this.name = "AuthError";
  }
}

/** Converts expected validation failures into HTTP-friendly errors. */
export class ValidationError extends Error {
  constructor(message: string, public readonly statusCode: number, public readonly details?: any) {
    super(message);
    this.name = "ValidationError";
    this.details = details;
  }
}