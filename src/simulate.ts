import { Processor } from "./processor.js";
import { PubSub } from "./pubSub.js";

// Initialize the PubSub system
const pubSub = new PubSub();

// Create the Processor that listens to `t1` and publishes to `t2`
const processor = new Processor(pubSub);

// Subscribe to outbound topics to log processed messages
pubSub.subscribe("T2", (message) => {
  console.log(`Received on T2: ${message}`);
});
pubSub.subscribe("T3", (message) => {
  console.log(`Received on T3: ${message}`);
});
pubSub.subscribe("T4", (message) => {
  console.log(`Received on T4: ${message}`);
});

// Publish a message to `t1`
pubSub.publish("T1", "ORDER BOOK COMMAND");

// Output:
// Received on t1: Hello, Topic 1!
// Received on t2: Processed: Hello, Topic 1!
