import { logMessage, Topic } from "./domainModels.js";
import { Processor } from "./processor.js";
import { PubSub } from "./pubSub.js";
import { v4 as uuidv4 } from "uuid";

// Initialize the PubSub system
const pubSub = new PubSub();
// Create the SUT Processor
const processor = new Processor(pubSub);
// Users
const users = ["user1", "user2", "user3"];
// Topics
const outboundTopics = ["T2", "T3", "T4"];

function subscriberAndLogTopicActivity(topic: Topic) {
  pubSub.subscribe(topic, (message) => {
    logMessage(topic, message);
  });
}

// Subscribe to outbound topics to log processed messages
outboundTopics.forEach(subscriberAndLogTopicActivity);

function workComplete(): boolean {
  return false;
}

// when the flow is completed place another order
pubSub.subscribe("T4", (message) => {
  if (!workComplete()) {
    pubSub.publish("T1", {
      ...message,
      messageId: uuidv4(),
      content: "Order Book Command",
    });
  }
});

users.forEach((user) => {
  // Publish a message to `t1`
  pubSub.publish("T1", {
    user: user,
    messageId: uuidv4(),
    content: "Order Book Command",
  });
});
