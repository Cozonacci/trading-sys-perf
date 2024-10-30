import { logger } from "./logger.js";

// types
type Topic = string;
type Message = { user: string; messageId: string; content: any };
type Listener = (message: Message) => void;

// functions
function logMessage(topic: Topic, message: Message): void {
  const currentTime = new Date().toISOString();
  logger.info(
    `Message received [${topic}][${currentTime}][${message.user}][${message.messageId}][${message.content}]`
  );
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function simulateProcessing() {
  await delay(getRandomNumber(400, 600));
}

export { Message, Topic, Listener, logMessage, simulateProcessing };
