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
        this.router.navigateByUrl(this.auth.getLandingUrl());
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
    const msg = this.commonUtilityService.validateDOB(this.userInfo.dob);
    if (msg) {
      this.invalidDOB = true;
      this.notification = this.commonUtilityService.setNotificationObject('error', msg);
    } else {
      this.invalidDOB = false;
      this.enableSaveButton();
    }
  }
  checkPasswordMatch() {
    const msg = this.commonUtilityService.checkPasswordMatch(this.userInfo.password, this.password2);
    if (msg) {
      this.invalidPassword = true;
      this.notification = this.commonUtilityService.setNotificationObject('error', msg);
    } else {
      this.invalidPassword = false;
      this.enableSaveButton();
    }
  }
}
