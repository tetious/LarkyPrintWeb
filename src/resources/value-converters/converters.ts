export class HumanFileSizeValueConverter {
  toView(value) {
    if(!value || isNaN(value)) return;
    const k = (value / 1024.0);
    if(k < 1000) {
      return k.toFixed(1) + " kb";
    }
    return (k / 1024).toFixed(1) + " mb";
  }
}

