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

module.exports = TestActorManager;
