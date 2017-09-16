import { SocketHelper, OpCode } from './socketHelper';
import { autoinject, inject } from 'aurelia-dependency-injection';
import { HttpClient } from 'aurelia-http-client';

interface Temperatature {
  set: number;
  current: number;
}

export interface PrinterStatus {
  e0Temp: Temperatature;
  bedTemp: Temperatature;
}

interface PrinterStatusMessage {
  s: number[];
}

interface FileListing {
  name: string;
  size: number;
}

@inject(HttpClient)
export class PrinterService {
  constructor(private http: HttpClient, private ws = new SocketHelper("ws://192.168.0.169/ws")) {
    this.ws.sub(OpCode.screenUpdate, this.statusUpdateMessage);
  }

  private statusUpdate: (PrinterStatus) => void = null;
  private screenUpdateCb: ([]) => void = null;
  private apiBase = "http://192.168.0.169";

  private statusUpdateMessage = (ev: PrinterStatusMessage) => {
    // 184/0   183/0   ?   0 ?   0 ?  0    100%  SD---% 00:00Glide [2017.08.12] r
    // 152/0  151/0  ?   0 ?   0?  0   100%SD---%00:00Glide [2017.08.12] r
    // 153/0   153/0   ?   0 ?   0 ?  0    100%  SD---% 00:00Glide [2017.08.12] r

    if (!ev.s) { return; }
    var str = ev.s.map(i => i > 39 ? String.fromCharCode(i) : ' ').join('');
    if (this.screenUpdateCb) {
      const lines = [], source = ev.s;
      while (source.length > 0) {
        lines.push(source.splice(0, 20));
      }
      this.screenUpdateCb(lines);
    }
    var bits = str.substr(0, 54).split(' ').filter(i => i !== '');
    if (bits.length !== 10) { return; }
    var e0 = bits[0].split('/');
    var bed = bits[1].split('/');
    var status = { e0Temp: { current: e0[0], set: e0[1] }, bedTemp: { current: bed[0], set: bed[1] } };
    if (this.statusUpdate) this.statusUpdate(status);
  }

  onOpen = this.ws.onOpen;

  uploadFile(file: File, progress: (pct) => void) {
    const form= new FormData();
    form.append("file", file);

    return new Promise(resolve => {
    this.http.createRequest(this.apiBase + "/sd")
      .asPost()
      .withProgressCallback(f => progress(f.loaded / f.total * 100))
      .withContent(form)
      .send().then(r => resolve());
    });
  }

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
      this.http.get(this.apiBase + "/sd").then(r => resolve(r.content.files));
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
