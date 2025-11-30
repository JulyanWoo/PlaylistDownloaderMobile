/**
 * Simple in-memory logger for debugging on device
 */
class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = 100;
  }

  log(message, data = null) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      id: Date.now() + Math.random(),
      timestamp,
      type: "info",
      message,
      data: data ? JSON.stringify(data, null, 2) : null,
    };
    this.addLog(logEntry);
    console.log(`[Logger] ${message}`, data || "");
  }

  error(message, error = null) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      id: Date.now() + Math.random(),
      timestamp,
      type: "error",
      message,
      data: error
        ? error.message || JSON.stringify(error, null, 2)
        : null,
    };
    this.addLog(logEntry);
    console.error(`[Logger] ${message}`, error || "");
  }

  addLog(entry) {
    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
  }

  getLogs() {
    return this.logs;
  }

  clear() {
    this.logs = [];
  }
}

export default new Logger();
