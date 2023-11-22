import winston from "winston";

const DEFAULT_CATEGORY = "DEFAULT";

const createLoggerConfig = (category) => {
  return {
    level: "info",
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.label({
        label: category,
      }),
      winston.format.timestamp(),
      winston.format.printf((info) => {
        return `${info.timestamp} - ${info.label}:${info.level}: ${info.message}`;
      }),
    ),
  };
};

winston.loggers.add(DEFAULT_CATEGORY, createLoggerConfig(DEFAULT_CATEGORY));

export const defaultLogger = winston.loggers.get(DEFAULT_CATEGORY);
export { createLoggerConfig };
