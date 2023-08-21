import { ErrorEnum } from "../enum/error.enum.js";

export const errorMiddleware = (error, req, res, next) => {
  console.log(error.cause+"en middleware");
  switch (error.code) {
    case ErrorEnum.INVALID_TYPES_ERROR:
      res.send({ status: "error", error: error.name, cause: error.cause });
      break;
    case ErrorEnum.PARAM_ERROR:
      res.send({ status: "error", error: error.name, cause: error.cause });
    default:
      res.send({ status: "error", mensaje: "error no manejado" });
  }
};
