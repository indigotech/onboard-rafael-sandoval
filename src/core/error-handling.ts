export const formatError = (error: any): ICustomError => {
  const { message, code, additionalInfo } = error.originalError;
  return {
    ...error,
    message,
    code,
    additionalInfo,
  };
};

export class CustomError extends Error {
  code: number;
  additionalInfo?: string;

  constructor(message: string, code: number, additionalInfo?: string) {
    super(message);
    this.code = code;
    this.additionalInfo = additionalInfo;
  }
}

interface ICustomError {
  message: string;
  code: number;
  additionalInfo?: string;
}
