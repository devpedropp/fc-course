import Customer from "../../customer/entity/customer";
import CustomerAddressChangedEvent from "../../customer/event/customer-address-changed.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import EnviaConsoleLogAddressChangedHandler from "../../customer/event/handler/envia-console-log-address-changed.handler";
import EnviaConsoleLog1Handler from "../../customer/event/handler/envia-console-log1.handler";
import EnviaConsoleLog2Handler from "../../customer/event/handler/envia-console-log2.handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  describe("Customer Events", () => {
    let eventDispatcher!: EventDispatcher;

    beforeAll(() => {
      eventDispatcher = new EventDispatcher();
    });

    afterEach(() => {
      eventDispatcher.unregisterAll();
    })

    it("should notify two handlers when customer is created", () => {
      const eventHandler = new EnviaConsoleLog1Handler();
      const eventHandler2 = new EnviaConsoleLog2Handler();

      const spyEventHandler = jest.spyOn(eventHandler, "handle");
      const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

      eventDispatcher.register("CustomerCreatedEvent", eventHandler);
      eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

      const customerEvent = new CustomerCreatedEvent(new Customer("1", "Pedro"));

      eventDispatcher.notify(customerEvent);

      expect(spyEventHandler).toHaveBeenCalled();
      expect(spyEventHandler2).toHaveBeenCalled();
    });

    it("should notify when customer address is changed", () => {
      const eventHandler = new EnviaConsoleLogAddressChangedHandler();

      const spyEventHandler = jest.spyOn(eventHandler, "handle");

      eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

      const customerEvent = new CustomerAddressChangedEvent({
        id: "1",
        endereco: "Rua Teste, 22, Vila Teste",
        nome: "Pedro"
      });

      eventDispatcher.notify(customerEvent);

      expect(spyEventHandler).toHaveBeenCalled();
    });
  });
});
