import { Listener, Message, Topic } from "./domainModels.js";

class PubSub {
  private topics: { [key: string]: Array<Listener> } = {};

  subscribe(topic: Topic, listener: Listener): void {
    if (!this.topics[topic]) {
      this.topics[topic] = [];
    }
    this.topics[topic].push(listener);
  }

  unsubscribe(topic: Topic, listener: Listener): void {
    if (!this.topics[topic]) return;

    this.topics[topic] = this.topics[topic].filter((l) => l !== listener);
  }

  publish(topic: Topic, message: Message): void {
    if (!this.topics[topic]) return;

    this.topics[topic].forEach((listener) => listener(message));
  }
}

export { PubSub };
