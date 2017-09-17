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
  @bindable screen: string[];

  constructor(private printerService: PrinterService) {
    this.printerService.subscribeStatusUpdates((s) => {
      this.printer = s;
    });
    this.printerService.subscribeScreenUpdates(s => {
     this.screen = s;
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
      }).then(() => this.uploading = false);
    }
  }

  getSdFiles() {
    this.printerService.getSDFiles().then(files => this.sdFiles = files);
  }

  menu(which) {
    this.printerService.menu(which);
  }
}
