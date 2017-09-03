
import {bindable} from 'aurelia-framework';
export class Gage {
  guage: any;
  @bindable div : HTMLDivElement;
  @bindable min = 0;
  @bindable max = 300;
  @bindable title = "";
  @bindable label = "";
  @bindable value = 0;

  valueChanged(newValue) {
    if(!this.guage) { return; }
    this.guage.refresh(newValue);
  }

  attached() {
    this.guage = new JustGage({
      parentNode: this.div,
      min: this.min,
      max: this.max,
      title: this.title,
      label: this.label,
      value: this.value     
    });
  }

}

