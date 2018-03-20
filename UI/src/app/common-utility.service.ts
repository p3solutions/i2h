import { Injectable } from '@angular/core';

@Injectable()
export class CommonUtilityService {

  constructor() { }

  handleInputLabelName(e) {
    const inputValue = e.target.value;
    const classList = e.target.classList;
    if (inputValue !== '') {
      classList.add('has-content');
    } else {
      classList.remove('has-content');
    }
  }
  allowOnlyNumbers(e) {
    const keyCode = e.keyCode || e.which;
    // console.log(keyCode, e);
    const ctrlA = (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true));
    const ctrlC = (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true));
    const ctrlV = (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true));
    const ctrlX = (e.keyCode === 88 && (e.ctrlKey === true || e.metaKey === true));
    const notNum = e.shiftKey || (!(e.keyCode === 8) && // backspace
      (e.keyCode < 35 || e.keyCode > 40) &&
      !(e.keyCode === 46) && // delete
      (e.keyCode < 48 || e.keyCode > 57));
    if (notNum && !ctrlA && !ctrlC && !ctrlX && !ctrlV ) { // allowing Ctrl combo keys & disallowing non-numbers
      // console.log('preventing');
      e.preventDefault();
    }
  }
  pasteOnlyNumbers(e) {
    const pastedText = e.clipboardData.getData('Text');
    const numRegex = /^[0-9]+$/;
    if (!pastedText.match(numRegex)) {
      e.preventDefault();
      // console.log(pastedText, 'prevented');
    }
  }
  setNotificationObject(notification, type, msg) {
    notification.show = true;
    if (type.toLowerCase() === 'error') {
      notification.message = msg ? msg : 'Error';
      notification.classCss = 'alert-danger';
    } else if (type.toLowerCase() === 'success') {
      notification.message = msg ? msg : 'Success';
      notification.classCss = 'alert-success';
    } else {
      notification.message = msg ? msg : 'Unknown';
      console.log('unknown type');
    }
    setTimeout(() => {
      const closeBtn = <HTMLButtonElement> document.querySelector('#notification-block button');
      closeBtn.click();
    }, 4000);
  }
}
