import { Component, OnInit } from '@angular/core';
import { CommonUtilityService } from '../common-utility.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NotificationObject } from '../i2h-objects';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthenticationService, TokenPayload, UserDetails } from '../authentication.service';
import * as  $ from 'jquery';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  userInfo: TokenPayload = {
    _id: '',
    email: '',
    password: '',
    otp: '',
    fname: '',
    lname: '',
    mobile: '',
    dob: '',
    sex: ''
  };
  inProgress = false;
  enableSaveBtn: boolean;
  password2 = '';
  notification: NotificationObject;
  today = (new Date()).toISOString().split('T')[0];
  invalidDOB = true;
  invalidPassword = true;

  constructor(
    private auth: AuthenticationService,
    private commonUtilityService: CommonUtilityService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => this.userInfo.email = params.email);
  }

  ngOnInit() {
  }

  handleLabelName(e) {
    this.commonUtilityService.handleInputLabelName(e);
  }
  allowOnlyNumbers(e) {
    this.commonUtilityService.allowOnlyNumbers(e);
  }
  pasteOnlyNumbers(e) {
    this.commonUtilityService.pasteOnlyNumbers(e);
  }

  enableSaveButton() {
    if (this.enableSave()) {
      this.enableSaveBtn = true;
    } else {
      this.enableSaveBtn = false;
    }
  }
  closeNotification() {
    this.notification = new NotificationObject();
  }

  onSave() {
    this.inProgress = true;
    this.auth.register(this.userInfo).subscribe((res) => {
      this.inProgress = false;
      if (res && res.hasUserInfo) { // existing user with details
        this.notification = this.commonUtilityService.setNotificationObject('success', res.message);
        this.router.navigateByUrl(this.auth.getOrderUrl());
      }
    }, (err) => {
      console.error(err);
      this.inProgress = false;
      this.notification = this.commonUtilityService.setNotificationObject('error', err.error.message);
    });
  }
  enableSave() {
    return this.userInfo.fname.trim() !== '' &&
      // this.userInfo.lname.trim() !== '' &&
      this.userInfo.mobile.length === environment.mobileDigit &&
      this.userInfo.dob !== '' && !this.invalidDOB &&
      this.userInfo.sex !== '' &&
      !this.invalidPassword;
  }
  validateDOB() {
    const dob = this.userInfo.dob;
    if (dob !== '') {
      const dobArray = dob.split('-');
      const dobyyyy = dobArray[0];
      const dobmm = dobArray[1];
      const dobdd = dobArray[2];
      const yyyy = this.today.split('-')[0];
      const mm = this.today.split('-')[1];
      const dd = this.today.split('-')[2];
      let msg;
      if (!(dobyyyy >= '1900' && dobyyyy <= yyyy)) {
        msg = 'Year range not allowed';
      } else if (dobyyyy === yyyy && dobmm > mm) {
        msg = 'Month range not allowed';
      } else if (dobyyyy === yyyy && dobmm === mm && dobdd > dd) {
        msg = 'Day range not allowed';
      } else {
        this.invalidDOB = false;
      }
      if (msg) {
        this.invalidDOB = true;
        this.notification = this.commonUtilityService.setNotificationObject('error', msg);
      }
      this.enableSaveButton();
    }
  }
  checkPasswordMatch() {
    const pswd = this.userInfo.password;
    let msg;
    if (!(pswd !== '' && pswd.length >= environment.passwordMinLength &&
       pswd.length <= environment.passwordMaxLength)) {
      msg = 'Invalid Password';
    } else if (pswd !== this.password2) {
      msg = 'Retype password mismatch';
    } else {
      this.invalidPassword = false;
    }
    if (msg) {
      this.invalidPassword = true;
      this.notification = this.commonUtilityService.setNotificationObject('error', msg);
    }
    this.enableSaveButton();
  }
}
