type Listener = (message: any) => void;

class PubSub {
  private topics: { [key: string]: Array<Listener> } = {};

  subscribe(topic: string, listener: Listener): void {
    if (!this.topics[topic]) {
      this.topics[topic] = [];
    }
    this.topics[topic].push(listener);
  }

  unsubscribe(topic: string, listener: Listener): void {
    if (!this.topics[topic]) return;

    this.topics[topic] = this.topics[topic].filter((l) => l !== listener);
  }

  publish(topic: string, message: any): void {
    if (!this.topics[topic]) return;

    this.topics[topic].forEach((listener) => listener(message));
  }
}

export { PubSub };
