import pino from "pino";

// Create a logger instance
const logger = pino({
  transport: {
    targets: [
      {
        target: "pino-pretty", // For human-readable output in the console
        options: { colorize: true },
        level: "info", // Adjust the console log level if needed
      },
      {
        target: "pino/file", // Logs to a file in JSON format
        options: { destination: "./logs/app.log" },
        level: "info", // File log level
      },
    ],
  },
  timestamp: pino.stdTimeFunctions.isoTime, // ISO format for timestamps
});

export { logger };
