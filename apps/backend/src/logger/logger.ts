import pino from 'pino';
import path from 'path';

// Define the absolute path where your JSON log file will live
const logFilePath = path.join(process.cwd(), 'logs', 'dev-local.json');

export const logger = pino({
  level: 'info', // Adjust to 'debug' or 'trace' if you want deeper dev logs
  transport: {
    targets: [
      {
        // Target 1: The Terminal (Human-Readable)
        target: 'pino-pretty',
        level: 'info',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
        },
      },
      {
        // Target 2: The Local JSON File (Raw Structured Data)
        target: 'pino/file',
        level: 'info',
        options: {
          destination: logFilePath,
          mkdir: true, // Automatically creates the "logs" directory if it doesn't exist
        },
      },
    ],
  },
});