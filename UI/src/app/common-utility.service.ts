import { Injectable } from '@angular/core';

@Injectable()
export class CommonUtilityService {

  constructor() { }

  allowOnlyNumbers(e) {
    const keyCode = e.keyCode || e.which;
    console.log(keyCode, e);
    const ctrlA = (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true));
    const ctrlC = (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true));
    const ctrlV = (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true));
    const ctrlX = (e.keyCode === 88 && (e.ctrlKey === true || e.metaKey === true));
    const notNum = e.shiftKey || (!(e.keyCode === 8) && // backspace
      (e.keyCode < 35 || e.keyCode > 40) &&
      !(e.keyCode === 46) && // delete
      (e.keyCode < 48 || e.keyCode > 57));
    if (notNum && !ctrlA && !ctrlC && !ctrlX && !ctrlV ) { // allowing Ctrl combo keys & disallowing non-numbers
      console.log('preventing');
      event.preventDefault();
    }
  }
  pasteOnlyNumbers(e) {
    const pastedText = e.clipboardData.getData('Text');
    const numRegex = /^[0-9]+$/;
    if (!pastedText.match(numRegex)) {
      e.preventDefault();
      console.log(pastedText, 'prevented');
    }
  }
}
