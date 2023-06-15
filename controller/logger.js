const { createLogger, transports, format } = require("winston");

const movieLogger = createLogger({
  transports: [
    new transports.Console({
      level: "info",
    }),
    new transports.File({
      filename: "movies.log",
      level: "info",
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.File({
      filename: "movies-error.log",
      level: "error",
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

module.exports = { movieLogger };
