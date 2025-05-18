import { ErrorRequestHandler } from "express";

export const globalErrorHandler: ErrorRequestHandler = (
  _error,
  _req,
  _res,
  _next
) => {
  console.error("💥 Global Error Handler Caught:", _error);
  if (_error instanceof Error) {
    _res.status(500).json({
      message: _error.message,
    });
  }

  _res.status(500).json({
    message: "Error occured",
  });
};
