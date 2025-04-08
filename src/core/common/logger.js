import fs from "fs";
import path from "path";

// Function to remove circular references from an object
function removeCircularReferences(obj) {
  const seen = new Set();
  return JSON.stringify(
    obj,
    (key, value) => {
      if (value !== null && typeof value === "object") {
        if (seen.has(value)) {
          return; // Return undefined to omit the circular reference
        }
        seen.add(value);
      }
      return value;
    },
    2
  );
}

const levels = {
  info: "INFO",
  warn: "WARN",
  error: "ERROR",
  debug: "DEBUG",
};

// Ensure the logs directory exists
// const logsDir = path.join(__dirname, "logs");
// if (!fs.existsSync(logsDir)) {
//   fs.mkdirSync(logsDir);
// }

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, "logs");

// Get the current date for log file naming
function getLogFileName() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return path.join(logsDir, `log-${year}-${month}-${day}.txt`);
}

// Format the log message
function formatMessage(level , message )  {
  const timestamp = new Date().toISOString();
  if (typeof message === "object") {
    message = removeCircularReferences(message);
  }
  return `[${timestamp}] [${level}] ${message}\n`;
}

// Write log to file
function writeLogToFile(level, message) {
  const logMessage = formatMessage(level, message);
  const logFile = getLogFileName();
  fs.appendFileSync(logFile, logMessage, "utf8");
}

const Logger = {
  info(message) {
    console.log(formatMessage(levels.info, message));
    writeLogToFile(levels.info, message);
  },
  warn(message) {
    console.warn(formatMessage(levels.warn, message));
    writeLogToFile(levels.warn, message);
  },
  error(message) {
    console.error(formatMessage(levels.error, message));
    writeLogToFile(levels.error, message);
  },
  debug(message) {
    if (process.env && process.env.DEBUG) {
      console.log(formatMessage(levels.debug, message));
      writeLogToFile(levels.debug, message);
    }
  },
};

export default Logger;
