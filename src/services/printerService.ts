import { SocketHelper, OpCode } from './socketHelper';
import { autoinject } from 'aurelia-dependency-injection';

interface Temperatature {
  set: number;
  current: number;
}

export interface PrinterStatus {
  e0Temp: Temperatature;
  bedTemp: Temperatature;
}

interface PrinterStatusMessage {
  status: string;
}

interface FileListing {
  name: string;
  size: number;
}

export class PrinterService {
  constructor(private ws = new SocketHelper(new WebSocket("ws://192.168.0.169"))) {
    this.ws.sub(OpCode.printerStatus, this.statusUpdateMessage);
  }

  private statusUpdate: (PrinterStatus) => void = null;
  private screenUpdateCb: ([]) => void = null;

  private statusUpdateMessage = (ev: PrinterStatusMessage) => {
    // 184/0   183/0   ?   0 ?   0 ?  0    100%  SD---% 00:00Glide [2017.08.12] r
    // 152/0  151/0  ?   0 ?   0?  0   100%SD---%00:00Glide [2017.08.12] r
    // 153/0   153/0   ?   0 ?   0 ?  0    100%  SD---% 00:00Glide [2017.08.12] r
    if (!ev.status) { return; }
    if (this.screenUpdateCb) {       this.screenUpdateCb(ev.status.match(/.{20}/g));     }
    var bits = ev.status.substr(0, 54).split(' ').filter(i => i !== '');
    if (bits.length !== 10) { return; }
    var e0 = bits[0].split('/');
    var bed = bits[1].split('/');
    var status = { e0Temp: { current: e0[0], set: e0[1] }, bedTemp: { current: bed[0], set: bed[1] } };
    if (this.statusUpdate) this.statusUpdate(status);
  }

  onOpen = this.ws.onOpen;

  uploadFile = this.ws.fileUpload;

  menuClick() {
    this.ws.sendOp({ op: OpCode.menuClick });
  }

  menuUp() {
    this.ws.sendOp({ op: OpCode.menuUp });
  }

  sendOp(op) {
    this.ws.sendOp({ op: op });
  }

  getSDFiles(): Promise<FileListing[]> {
    return new Promise(resolve => {
      this.ws.sendOp({ op: OpCode.fileListing }, msg => {
        resolve(msg.files);
      })
    });
  }

  menuDown() {
    this.ws.sendOp({ op: OpCode.menuDown });
  }

  subscribeStatusUpdates(hook: (PrinterStatus) => void) {
    this.statusUpdate = hook;
  }

  subscribeScreenUpdates(cb) {
    this.screenUpdateCb = cb;
  }
}
