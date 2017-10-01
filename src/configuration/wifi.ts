import { ConfigurationService, WifiNetwork, ConnectionStatus } from './../services/configurationService';
import { autoinject, bindable } from 'aurelia-framework';
@autoinject
export class Wifi { 

  @bindable wifiNetworks: WifiNetwork[];
  @bindable loading = false;
  @bindable status: ConnectionStatus;
  @bindable ssid;
  @bindable password;
  @bindable passwordRequired = false;

  constructor(private configuationService: ConfigurationService) {}

  attached() {
    this.refreshNetworks();
    this.refreshStatus();
  }

  networkSelected(network: WifiNetwork) {
    this.ssid = network.ssid;
    this.passwordRequired = network.secure;
  }

  refreshStatus() {
    this.configuationService.getStatus().then(status => {
      this.status = status;
    });
  }

  refreshNetworks() {
    this.loading = true;
    this.configuationService.getNetworks().then(networks => {
      this.wifiNetworks = networks;
      this.loading = false;
    });    
  }
  
  connect() {
    this.configuationService.wifiConnect(this.ssid, this.password).then(_ => this.refreshStatus());
  }

}
