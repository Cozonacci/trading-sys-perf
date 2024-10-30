import { LogEntry, readAndParsePinoLog } from "./logParse.js";
import { parse, writeToPath } from "fast-csv";

type TransationId = string;
type TopicEvent = { topic: number; time: string };
type Duration = { start: string; end: string };

// stores transactions
const transactions = new Map<TransationId, Array<TopicEvent>>();

// Parse topic (as a confirmation)
function extractTopicNr(input: string): number | null {
  const match = input.match(/\[T(\d+)]/);
  return match ? parseInt(match[1], 10) : null;
}

function extractUuid(input: string): string | null {
  const uuidRegex =
    /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi;
  const match = input.match(uuidRegex);
  return match ? match[0] : null;
}

function loadTransactions(logs: LogEntry[]) {
  logs.forEach((log) => {
    const messageId = extractUuid(log.msg);
    const topicNr = extractTopicNr(log.msg);
    if (!transactions.has(messageId)) {
      transactions.set(messageId, []);
    }
    transactions.get(messageId)!.push({ topic: topicNr, time: log.time });
  });
}

const transactionDuration = new Map<TransationId, Duration>();

function calculateDuration(topicEvents: Array<TopicEvent>): Duration {
  const result = { start: "", end: "" };
  topicEvents.forEach((ev) => {
    if (ev.topic === 1) {
      result.start = ev.time;
    }
    if (ev.topic === 4) {
      result.end = ev.time;
    }
  });
  return result;
}

function processTransactions() {
  transactions.forEach((topicEvents, transactionId) => {
    transactionDuration.set(transactionId, calculateDuration(topicEvents));
  });
}

(async () => {
  const logPath = "./logs/app.log";
  const parsedTransactionsFromLog = await readAndParsePinoLog(logPath);
  loadTransactions(parsedTransactionsFromLog);
  processTransactions();
  const transactionsAsCSV = Array.from(transactionDuration, ([key, value]) => ({
    transactionsId: key,
    start: value.start,
    end: value.end,
  }));
  console.log("Aggreagate Transactions", transactions);
  console.log("Processed Transactions", transactionDuration);
  console.log("CSV", transactionsAsCSV);
  writeToPath("./report/transactions.csv", transactionsAsCSV, {
    headers: true,
  }).on("finish", () => console.log("CSV file written successfully"));
})();
