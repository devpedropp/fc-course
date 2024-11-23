import EventInterface from "../../@shared/event/event.interface";
import { AddressChangedInterface } from "./customer-address-changed.interface";

export default class CustomerAddressChangedEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: AddressChangedInterface;

  constructor(eventData: AddressChangedInterface) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}
