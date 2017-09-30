import { Configuration } from '../configuration';
import { autoinject } from 'aurelia-framework';
import { HttpClient } from "aurelia-http-client";

export enum WifiStatus {
  Idle,
  NoSsidAvailable,
  ScanComplete,
  Connected,
  ConnectFailed,
  ConnectionLost,
  Disconnected
}

export interface ConnectionStatus {
  ip: string;
  status: WifiStatus;
}

export interface WifiNetwork {
  ssid: string;
  rssi: number;
  secure: boolean;
}

@autoinject
export class ConfigurationService {
  constructor(private http: HttpClient) {}

  getStatus(): Promise<ConnectionStatus> {
    return new Promise(resolve => {
      this.http.get(Configuration.apiBase + "/wifi/status").then(r => resolve(r.content));
    });
  }

  getNetworks(): Promise<WifiNetwork[]> {
    return new Promise(resolve => {
      this.http.get(Configuration.apiBase + "/wifi").then(r => resolve(r.content));
    });
  }

}
