import * as fs from "fs";
import * as readline from "readline";

interface LogEntry {
  time: string;
  msg: string;
}

async function readAndParsePinoLog(filePath: string): Promise<LogEntry[]> {
  const logEntries: LogEntry[] = [];

  const fileStream = fs.createReadStream(filePath, "utf8");
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    try {
      const entry: LogEntry = JSON.parse(line);
      logEntries.push(entry);
    } catch (error) {
      console.error("Error parsing line:", line, error);
    }
  }

  return logEntries;
}

export { LogEntry, readAndParsePinoLog };
