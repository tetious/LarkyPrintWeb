
import {bindable} from 'aurelia-framework';
export class Gage {
  guage: any;
  @bindable div : HTMLDivElement;
  @bindable min = 0;
  @bindable max = 300;
  @bindable title = "";
  @bindable label = "";
  @bindable value = 0;

  attached() {
  }

}

