import { SUT } from "./sut.js";
import { TaskQueue } from "./taskQueue.js";
import { TestActor } from "./testActor.js";
import { TestActorManager } from "./testActorManager.js";

// Simulating the system
async function main() {
  const T1 = new TaskQueue("T1"); // Task queue representing topic T1
  const sut = new SUT(); // The system under test
  const manager = new TestActorManager();

  // Test actors that place orders and listen to T2, T3, T4 messages
  const orderPlacer = new TestActor("Order Placer Worker", T1, manager);
  const orderListener = new TestActor(
    "Order Listener Worker",
    new TaskQueue("T2T3T4"),
    manager
  );

  // Placing an order
  const newOrder = { id: 1, item: "Item 1", status: "new" };
  manager.addOrder(newOrder);
  await orderPlacer.placeOrder(newOrder);

  // SUT processing the order in T1 and sending messages to T2, T3, T4
  await sut.receiveOrder(newOrder);
  await sut.processAll();

  // Test actor listens to messages on T2, T3, T4 and informs the manager
  await orderListener.listenToMessages();
}

main().catch(console.error);
