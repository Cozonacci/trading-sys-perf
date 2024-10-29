import { logMessage, Message, simulateProcessing } from "./domainModels.js";
import { PubSub } from "./pubSub.js";

class Processor {
  constructor(private pubSub: PubSub) {
    this.init();
  }

  private init(): void {
    this.pubSub.subscribe("T1", this.processMessage.bind(this));
  }

  private processMessage(message: Message): void {
    logMessage("T1", message);

    // simulate heavy processing in SUT
    simulateProcessing().then(() => {
      [
        { topic: "T2", status: "Received" },
        { topic: "T3", status: "Confirmed" },
        { topic: "T4", status: "Processed" },
      ].forEach((item) => {
        this.pubSub.publish(item.topic, {
          ...message,
          content: `${message.content} ${item.status}`,
        });
      });
    });
  }
}

export { Processor };
