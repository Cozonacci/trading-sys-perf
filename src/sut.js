const TaskQueue = require("./taskQueue.js")
class SUT {
    constructor() {
        this.taskQueues = {
            T2: new TaskQueue('T2'),
            T3: new TaskQueue('T3'),
            T4: new TaskQueue('T4')
        };
    }

    async receiveOrder(order) {
        console.log(`[SUT] Processing order:`, order);

        // Simulate processing and sending messages to T2, T3, T4 topics
        const processedMessage = { orderId: order.id, status: 'processed' };
        await this.taskQueues.T2.addMessage(processedMessage);
        await this.taskQueues.T3.addMessage(processedMessage);
        await this.taskQueues.T4.addMessage(processedMessage);
    }

    async processAll() {
        await Promise.all([
            this.taskQueues.T2.processMessages(this.handleProcessedMessage),
            this.taskQueues.T3.processMessages(this.handleProcessedMessage),
            this.taskQueues.T4.processMessages(this.handleProcessedMessage)
        ]);
    }

    async handleProcessedMessage(message, queueName) {
        console.log(`[SUT] Message processed from ${queueName}:`, message);
    }
}

module.exports = SUT;