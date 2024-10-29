// types
type Topic = string;
type Message = { user: string; messageId: string; content: any };
type Listener = (message: Message) => void;

// functions
function logMessage(topic: Topic, message: Message): void {
  const currentTime = new Date().toISOString();
  console.log(
    `Message received [${topic}][${currentTime}][${message.user}][${message.messageId}][${message.content}]`
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function simulateProcessing() {
  await delay(2000); // Simulate a 2-second delay
}

export { Message, Topic, Listener, logMessage, simulateProcessing };
