export default class HTTPServiceError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "HTTPServiceError"
    Object.setPrototypeOf(this, new.target.prototype);
  }
}