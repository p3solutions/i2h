import { Injectable } from '@angular/core';
import { NotificationObject } from './i2h-objects';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as $ from 'jquery';

@Injectable()
export class CommonUtilityService {
  private subject = new Subject<any>();
  private today = (new Date()).toISOString().split('T')[0];

  constructor() { }

  sendData(componentUrl: string) {
    this.subject.next(componentUrl);
  }

  clearData() {
    this.subject.next();
  }

  getData(): Observable<any> {
    return this.subject.asObservable();
  }

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
    // const keyCode = e.keyCode || e.which;
    // console.log(keyCode, e);
    const ctrlA = (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true));
    const ctrlC = (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true));
    const ctrlV = (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true));
    const ctrlX = (e.keyCode === 88 && (e.ctrlKey === true || e.metaKey === true));
    const notNum = e.shiftKey || (!(e.keyCode === 8) && // backspace
      (e.keyCode < 35 || e.keyCode > 40) &&
      !(e.keyCode === 46) && // delete
      !(e.keyCode === 13) && // enter
      !(e.keyCode === 9) && // tab
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
  setNotificationObject(type, msg) {
    const notification = new NotificationObject();
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
      if (closeBtn) {
        closeBtn.click();
      }
    }, 4000);
    return notification;
  }

  getErrorNotification(err) {
    // if (err.error instanceof Error) {
    //   // A client-side or network error occurred. Handle it accordingly.
    //   console.log('An error occurred:', err.error.message);
    // }
    if (!environment.production) { // not for production
      console.log(`Backend returned code ${err.status}, body was: ${JSON.stringify(err.error)}`);
    }
    const msg = err && err.error && err.error.message ? err.error.message : err.statusText;
    const notification = this.setNotificationObject('error', msg);
    return notification;
  }

  handlePageLinkCLicks() {
    const pageLinks = $('.jq-page-link');
    pageLinks.on('click', function () {
      pageLinks.removeClass('active');
      $(this).addClass('active');
    });
  }
  validateDOB(dob) {
    let msg;
    if (dob !== '') {
      const dobArray = dob.split('-');
      const dobyyyy = dobArray[0];
      const dobmm = dobArray[1];
      const dobdd = dobArray[2];
      const yyyy = this.today.split('-')[0];
      const mm = this.today.split('-')[1];
      const dd = this.today.split('-')[2];
      if (!(dobyyyy >= '1900' && dobyyyy <= yyyy)) {
        msg = 'Year range not allowed';
      } else if (dobyyyy === yyyy && dobmm > mm) {
        msg = 'Month range not allowed';
      } else if (dobyyyy === yyyy && dobmm === mm && dobdd > dd) {
        msg = 'Day range not allowed';
      }
    }
    return msg;
  }
  checkPasswordMatch(newPassword, confirmPassword) {
    let msg;
    if (!(newPassword !== '' && newPassword.length >= environment.passwordMinLength &&
      newPassword.length <= environment.passwordMaxLength)) {
      msg = 'Invalid Password';
    } else if (newPassword !== confirmPassword) {
      msg = 'Confirmation password mismatch';
    }
    return msg;
  }
  disableOTP() {
    const otpBtn = <HTMLButtonElement>document.getElementById('otp-btn');
    otpBtn.disabled = true;
    setTimeout(function () { otpBtn.disabled = false; }, environment.otpDisableTime);
  }
  getArrayObjectById(array, id) {
    let obj;
    array.forEach(element => {
      if (element.id === id) {
        obj = element;
      }
    });
    return obj;
  }
  copyObject(srcObj, destObj) {
    for (const [key, value] of Object.entries(srcObj)) {
      destObj[key] = value;
    }
  }
}
