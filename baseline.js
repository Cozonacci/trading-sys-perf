class TaskQueue {
    constructor(name) {
        this.name = name;
        this.queue = [];
    }

    async addMessage(message) {
        console.log(`[${this.name}] Adding message:`, message);
        this.queue.push(message);
    }

    async getMessage() {
        return this.queue.length ? this.queue.shift() : null;
    }

    async processMessages(callback) {
        while (this.queue.length > 0) {
            const message = await this.getMessage();
            await callback(message, this.name);
        }
    }
}

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

class TestActorManager {
    constructor() {
        this.orders = {};
    }

    async handleMessage(message, queueName) {
        console.log(`[TestActorManager] Handling message from ${queueName}:`, message);

        // Example: Update or Cancel based on some condition
        if (message.status === 'processed') {
            console.log(`[TestActorManager] Deciding action for order ${message.orderId}`);
            // Arbitrarily decide to update or cancel
            if (Math.random() > 0.5) {
                await this.updateOrder(message.orderId);
            } else {
                await this.cancelOrder(message.orderId);
            }
        }
    }

    async updateOrder(orderId) {
        console.log(`[TestActorManager] Updating order ${orderId}`);
        // Simulate sending an update command on T1
    }

    async cancelOrder(orderId) {
        console.log(`[TestActorManager] Cancelling order ${orderId}`);
        // Simulate sending a cancel command on T1
    }

    addOrder(order) {
        this.orders[order.id] = order;
    }

    getOrder(orderId) {
        return this.orders[orderId];
    }
}

// Simulating the system
async function main() {
    const T1 = new TaskQueue('T1');  // Task queue representing topic T1
    const sut = new SUT();  // The system under test
    const manager = new TestActorManager();

    // Test actors that place orders and listen to T2, T3, T4 messages
    const orderPlacer = new TestActor('Order Placer Worker', T1, manager);
    const orderListener = new TestActor('Order Listener Worker', new TaskQueue('T2T3T4'), manager);

    // Placing an order
    const newOrder = { id: 1, item: 'Item 1', status: 'new' };
    manager.addOrder(newOrder);
    await orderPlacer.placeOrder(newOrder);

    // SUT processing the order in T1 and sending messages to T2, T3, T4
    await sut.receiveOrder(newOrder);
    await sut.processAll();

    // Test actor listens to messages on T2, T3, T4 and informs the manager
    await orderListener.listenToMessages();
}

main().catch(console.error);