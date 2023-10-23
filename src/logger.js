import winston from 'winston'
import config from "./config.js"

//Niveles de prioridad distintos y colores correspondientes
const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  },
  colors: {
    fatal: 'red',
    error: 'orange',
    warning: 'yellow',
    info: 'blue',
    http: 'blue',
    debug: 'white'
  }
}

//En Prod - agregamos transporte de consola y de archivo
const loggerProd = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({level: "info"}),
    new winston.transports.File({level: "error", filename: "./errors.log"})
  ]
})

//En Dev - agregamos transporte de consola
const loggerDev = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({level: "debug"})
  ]
})

// Ahora, a partir de un Middleware, vamos a colocar en el objeto req del logger
export const addLogger = (req, res, next) => {
  req.logger = config.ENVIRONMENT === "PRODUCTION" ? loggerProd : loggerDev;
  next();
}