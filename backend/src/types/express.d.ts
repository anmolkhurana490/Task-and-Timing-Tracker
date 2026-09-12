declare global {
  namespace Express {
    interface Request {
      userId?: string;
      valQuery?: any
    }
  }
}

export { };