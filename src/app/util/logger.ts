// @ts-nocheck
type LoggerType = {
  info: (...args: any) => void;
  debug: (...args: any) => void;
  error: (...args: any) => void;
  warn: (...args: any) => void;
};

function info(...args: any) {
  console.log(...args);
}

function debug(...args: any) {
  console.log(...args);
}

function error(...args: any) {
  console.error(...args);
}

function warn(...args: any) {
  console.warn(...args);
}

const Logger: LoggerType = {
  info,
  debug,
  error,
  warn,
};

export default Logger;
