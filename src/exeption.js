module.exports = class InternalException extends Error {
  constructor(...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InternalException);
    }

    const [name, message] = params;
    this.message = message;
    this.name = name;
    this.date = new Date();
  }
};
