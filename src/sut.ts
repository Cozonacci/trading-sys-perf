import { TaskQueue } from "./taskQueue.js";

class SUT {
  taskQueues: Map<string, TaskQueue>;

  constructor() {
    this.taskQueues = new Map<string, TaskQueue>();
    this.taskQueues.set("T2", new TaskQueue("T2"));
    this.taskQueues.set("T3", new TaskQueue("T3"));
    this.taskQueues.set("T4", new TaskQueue("T4"));
  }

  async receiveOrder(order) {
    console.log(`[SUT] Processing order:`, order);

    // Simulate processing and sending messages to T2, T3, T4 topics
    const processedMessage = { orderId: order.id, status: "processed" };
    await this.taskQueues.get("T2").addMessage(processedMessage);
    await this.taskQueues.get("T3").addMessage(processedMessage);
    await this.taskQueues.get("T4").addMessage(processedMessage);
  }

  async processAll() {
    await Promise.all([
      this.taskQueues.get("T2").processMessages(this.handleProcessedMessage),
      this.taskQueues.get("T3").processMessages(this.handleProcessedMessage),
      this.taskQueues.get("T4").processMessages(this.handleProcessedMessage),
    ]);
  }

  async handleProcessedMessage(message, queueName) {
    console.log(`[SUT] Message processed from ${queueName}:`, message);
  }
}

export { SUT };
