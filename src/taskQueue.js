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

module.exports = TaskQueue; 