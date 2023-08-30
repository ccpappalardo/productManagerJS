import { ErrorEnum } from "../enum/error.enum.js";

export const errorMiddleware = (error, req, res, next) => {
  
  req.logger.error(`Error name: ${error.name}`)

  switch (error.code) {
    case ErrorEnum.INVALID_TYPES_ERROR:
      return res.send({ status: "error", error: error.name, cause: error.cause });
    case ErrorEnum.PARAM_ERROR:
      return  res.send({ status: "error", error: error.name, cause: error.cause });
    case ErrorEnum.PRODUCT_ALREADY_EXIST:
      return  res.send({ status: "error", error: error.name, cause: error.cause });
    default:
      return res.send({ status: "error", mensaje: "error no manejado" });
  }
};
