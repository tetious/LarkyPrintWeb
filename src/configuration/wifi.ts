import { ConfigurationService, WifiNetwork } from './../services/configurationService';
import { autoinject, bindable } from 'aurelia-framework';
@autoinject
export class Wifi { 

  @bindable wifiNetworks: WifiNetwork[];

  constructor(private configuationService: ConfigurationService) {}

  attached() {
    this.refreshNetworks();
  }

  refreshNetworks() {
    this.configuationService.getNetworks().then(networks => this.wifiNetworks = networks);    
  }

}
