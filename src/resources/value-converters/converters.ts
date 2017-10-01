import { WifiStatus } from "../../services/configurationService";

export class HumanFileSizeValueConverter {
  toView(value) {
    if (!value || isNaN(value)) return;
    const k = (value / 1024.0);
    if (k < 1000) {
      return k.toFixed(1) + " kb";
    }
    return (k / 1024).toFixed(1) + " mb";
  }
}

export class PrinterScreenCharacterValueConverter {
  toView(value) {
    if (value > 32) return String.fromCharCode(value);

    switch (value) {
      case 0x02: 
        return '&nbsp;';
      case 0x03:
        return '<i class="oi" data-glyph="arrow-top"></i>'
    }

    return '&nbsp;';
  }
}

export class ConnectionStatusValueConverter {
  toView(value) {
    if (!value) return;
    return WifiStatus[value];
  }
}


