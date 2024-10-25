class TestActor {
    constructor(name, queue, manager) {
        this.name = name;
        this.queue = queue;
        this.manager = manager;
    }

    async placeOrder(order) {
        console.log(`[${this.name}] Placing order:`, order);
        await this.queue.addMessage(order);
    }

    async listenToMessages() {
        console.log(`[${this.name}] Listening for messages...`);
        await this.queue.processMessages(async (message, queueName) => {
            console.log(`[${this.name}] Received message from ${queueName}:`, message);
            await this.manager.handleMessage(message, queueName);
        });
    }
}

module.exports = TestActor; 