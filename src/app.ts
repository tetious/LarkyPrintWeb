import { autoinject, bindable } from 'aurelia-framework';
import { PrinterService, PrinterStatus } from './services/printerService';

@autoinject
export class App {
  @bindable printer: PrinterStatus;
  constructor(private printerService: PrinterService) {
    this.printerService.SubscribeStatusUpdates((s) => {
      this.printer = s;
      console.log(s);
    });
  }
  message = 'Hello World!';
}
