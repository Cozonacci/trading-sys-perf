import { Message, PubSub } from "./pubSub.js";

class Processor {
  constructor(private pubSub: PubSub) {
    this.init();
  }

  private init(): void {
    // Listen to topic `t1`
    this.pubSub.subscribe("T1", this.processMessage.bind(this));
  }

  private processMessage(message: Message): void {
    console.log(`Received on t1: ${message}`);

    this.pubSub.publish("T2", `Processed Message T2: ${message}`);
    this.pubSub.publish("T3", `Processed Message T3: ${message}`);
    this.pubSub.publish("T4", `Processed Message T4: ${message}`);
  }
}

export { Processor };
