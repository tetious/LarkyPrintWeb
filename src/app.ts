import { autoinject, bindable } from 'aurelia-framework';
import { PrinterService, PrinterStatus } from './services/printerService';

@autoinject
export class App {
  @bindable printer: PrinterStatus;
  @bindable files: FileList;
  @bindable sdFiles;
  @bindable sdUpload: HTMLButtonElement;
  @bindable uploadPercent;
  @bindable uploading;

  constructor(private printerService: PrinterService) {
    this.printerService.subscribeStatusUpdates((s) => {
      this.printer = s;
    });
    this.printerService.onOpen.push(() => {
      this.getSdFiles();
    });
  }

  attached() {
  }

  upload() {
    this.sdUpload.click();
  }

  filesChanged() {
    if (this.files && this.files.length == 1) {
      this.uploading = true;
      this.printerService.uploadFile(this.files[0], pct => {
        this.uploadPercent = pct;
        if (pct >= 100) {
          this.uploading = false;
        }
      });
    }
  }

  getSdFiles() {
    this.printerService.getSDFiles().then(files => this.sdFiles = files);
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
