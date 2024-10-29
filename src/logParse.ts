import * as fs from "fs";
import * as readline from "readline";
import { Message } from "./domainModels.js";

interface LogEntry {
  time: string;
  msg: string;
}

type TransationId = string;
type Duration = Array<string>;
const transactions = new Map<TransationId, Duration>();

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

function extractNumberFromBracketedT(input: string): number | null {
  const match = input.match(/\[T(\d+)]/);
  return match ? parseInt(match[1], 10) : null;
}

function createUUIDMap(
  logs: LogEntry[]
): Map<string, Array<{ topic: number; time: string }>> {
  const uuidMap = new Map<string, Array<{ topic: number; time: string }>>();
  const uuidRegex =
    /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi;
  const topicRegex = /^T\d$/;

  logs.forEach((log) => {
    const match = log.msg.match(uuidRegex);

    if (match) {
      const uuid = match[0]; // Assuming a single UUID per log message
      if (!uuidMap.has(uuid)) {
        uuidMap.set(uuid, []);
      }
      const topicNr = extractNumberFromBracketedT(log.msg);
      uuidMap.get(uuid)!.push({ topic: topicNr, time: log.time });
    }
  });

  return uuidMap;
}

(async () => {
  const filePath = "./logs/app.log";
  const logs = await readAndParsePinoLog(filePath);
  const transactionsL = createUUIDMap(logs);
  console.log("Parsed Logs:", transactionsL);
})();
