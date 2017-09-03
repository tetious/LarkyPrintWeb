import { autoinject, bindable } from 'aurelia-framework';
import { PrinterService, PrinterStatus } from './services/printerService';

@autoinject
export class App {
  @bindable printer: PrinterStatus;
  @bindable files: FileList;

  constructor(private printerService: PrinterService) {
    this.printerService.subscribeStatusUpdates((s) => {
      this.printer = s;
    });
  }

  upload() {
    console.log("files:" , this.files);
    this.printerService.uploadFile(this.files[0]);
  }
}
