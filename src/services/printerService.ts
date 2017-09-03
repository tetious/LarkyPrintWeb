import { SocketHelper } from './socketHelper';
import { autoinject } from 'aurelia-dependency-injection';

interface Temperatature {
  set: number;
  current: number;
}

export interface PrinterStatus {
  e0Temp: Temperatature;
  bedTemp: Temperatature;
}

export class PrinterService {
  constructor(private ws = new SocketHelper(new WebSocket("ws://192.168.0.149"))) {  }

  private statusUpdate: (PrinterStatus) => void = null;

  private websocketMessage = (ev: MessageEvent) => {
    // 184/0   183/0   ?   0 ?   0 ?  0    100%  SD---% 00:00Glide [2017.08.12] r
    // 152/0  151/0  ?   0 ?   0?  0   100%SD---%00:00Glide [2017.08.12] r
    // 153/0   153/0   ?   0 ?   0 ?  0    100%  SD---% 00:00Glide [2017.08.12] r
    if(!ev.data) { return; }
    var bits = ev.data.split(' ').filter(i => i !!=false);
    if(bits.length !== 10) { return; }
    var e0 = bits[0].split('/');
    var bed = bits[1].split('/');
    var status = {e0Temp: {current: e0[0], set: e0[1]}, bedTemp: {current: bed[0], set: bed[1]}};
    if(this.statusUpdate) this.statusUpdate(status);
  }

  uploadFile(file: File) {
    this.ws.fileUpload(file);
  }
  
  subscribeStatusUpdates(hook: (PrinterStatus) => void) {
    this.statusUpdate = hook;
  }
}
