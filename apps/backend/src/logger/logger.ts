import pino from 'pino';
import path from 'path';

// Define the absolute path where your JSON log file will live
const logFilePath = path.join(process.cwd(), 'logs', 'dev-local.json');

export const logger = pino({
  level: 'info', // Adjust to 'debug' or 'trace' if you want deeper dev logs
  ...(process.env.NODE_ENV === 'production' 
    ? {} // Native JSON logging in production (no pino-pretty required)
    : {
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              level: 'info',
              options: { colorize: true, ignore: 'pid,hostname' },
            },
            {
              target: 'pino/file',
              level: 'info',
              options: { destination: logFilePath, mkdir: true },
            },
          ],
        },
      }
  ),
});