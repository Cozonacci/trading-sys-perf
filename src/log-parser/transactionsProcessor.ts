import { LogEntry, readAndParsePinoLog } from "./logParse.js";

type TransationId = string;
type TopicEvent = { topic: number; time: string };

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

(async () => {
  const logPath = "./logs/app.log";
  const parsedTransactionsFromLog = await readAndParsePinoLog(logPath);
  loadTransactions(parsedTransactionsFromLog);
  console.log("Aggreagate Transactions", transactions);
})();
