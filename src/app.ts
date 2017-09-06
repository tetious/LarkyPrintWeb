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
    console.log("files:", this.files);
    this.printerService.uploadFile(this.files[0]);
  }

  sdSwap() {
    this.printerService.sendOp("swapSD");
  }

  menu(which) {
    switch (which) {
      case "up":
        this.printerService.menuUp();
        break;
      case "down":
        this.printerService.menuDown();
        break;
      case "click":
        this.printerService.menuClick();
        break;
    }
  }
}
