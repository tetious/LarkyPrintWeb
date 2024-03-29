import "../utils";

export enum OpCode {
  fileListing = "fileListing",
  fileUploadStart = "fileUploadStart",
  fileUploadComplete = "fileUploadComplete",
  fileUploadChunkAck = "fileUploadChunkAck",
  screenUpdate = "screenUpdate",
  menuClick = "menuClick",
  menuUp = "menuUp",
  menuDown = "menuDown"
}

interface Op {
  op: OpCode;
}

interface OpFileUploadStart extends Op {
  name: string;
  size: number;
}

interface OpPrinterStatus extends Op {
  msg: string;
}

export class SocketHelper {
  private opcodeHooks = {};
  private ws: WebSocket;

  constructor(private url) {
    this.ws = new WebSocket(url);
    this.initSocket();
  }

  private initSocket() {
    this.ws.onopen = _ => { if (this.onOpen) this.onOpen.forEach(onOpen => onOpen()); };
    this.ws.onclose = ev => {
      this.ws = new WebSocket(this.url);
      this.initSocket();
    }
    this.ws.onmessage = ev => {
      const str: string = ev.data;
      if(str.indexOf("{") < 0) {
        console.log(str);
        return;
      }
      const msg = JSON.parse(str);
      if (msg && msg.op && this.opcodeHooks[msg.op]) {
        this.opcodeHooks[msg.op](msg);
      }
    }
  }

  onOpen: { (): void; }[] = [];

  sendOp<T extends Op>(obj: T, cb: (msg: any) => void = null) {
    if (cb) {
      this.sub(obj.op, msg => {
        cb(msg);
        this.unsub(obj.op);
      });
    }
    this.ws.send(JSON.stringify(obj));
  }

  sub(opCode: OpCode, cb: (msg: Object) => void) {
    this.opcodeHooks[opCode] = cb;
  }

  unsub(opCode: OpCode) {
    delete this.opcodeHooks[opCode];
  }

  public fileUpload = (file: File, progress: (pct) => void) => {
    var fileSize = file.size;
    var chunkSize = 32 * 1024; // bytes
    var offset = 0;

    this.sendOp({ op: OpCode.fileUploadStart, name: "/sd/" + file.name, size: file.size });

    // read next chunk on ack
    this.sub(OpCode.fileUploadChunkAck, _ => readChunk(offset, chunkSize, file));

    const readEventHandler = evt => {
      if (evt.target.error == null) {
        offset += evt.target.result.byteLength;
        progress(offset / fileSize * 100);
        this.ws.send(evt.target.result);
      } else {
        console.log("Read error: " + evt.target.error);
        return;
      }
      if (offset >= fileSize) {
        console.log("Done reading file");
        this.sendOp({ op: OpCode.fileUploadComplete });
        this.unsub(OpCode.fileUploadChunkAck);
        return;
      }
    }

    const readChunk = (_offset, length, _file) => {
      var r = new FileReader();
      var blob = _file.slice(_offset, length + _offset);
      r.onload = readEventHandler;
      r.readAsArrayBuffer(blob);
    }

    readChunk(offset, chunkSize, file);
  }
}
