import { Component, OnInit } from '@angular/core';
import { CommonUtilityService } from '../common-utility.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NotificationObject } from '../i2h-objects';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthenticationService, TokenPayload } from '../authentication.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  userInfo: TokenPayload = {
    email: '',
    password: '',
    fname: '',
    lname: '',
    dob: '',
    sex: '',
    mobile: '',
  };
  inProgress = false;
  enableSaveBtn: boolean;
  password2 = '';
  notification: NotificationObject;

  constructor(
    private auth: AuthenticationService,
    private commonUtilityService: CommonUtilityService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => this.userInfo.email = params.email);
  }

  ngOnInit() { }

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
    // needs validation & notification https://docs.angularjs.org/api/ng/input/input%5Bdate%5D
    // console.log(this.userInfo, this.password2);
    if (this.enableSave()) {
      this.enableSaveBtn = true;
    } else {
      this.enableSaveBtn = false;
      // this.notification = this.commonUtilityService.setNotificationObject('error', 'Wrong input');
    }
  }
  closeNotification() {
    this.notification = new NotificationObject();
  }

  onSave() {
    this.inProgress = true;
    this.auth.register(this.userInfo).subscribe((res) => {
      console.log('reg resp->', res);
      this.router.navigateByUrl('/order');
      this.inProgress = false;
    }, (err) => {
      this.notification = this.commonUtilityService.setNotificationObject('error', err.error.message);
      console.error(err);
    });
  }
  enableSave() {
    return this.userInfo.fname.trim() !== '' && this.userInfo.lname.trim() !== '' &&
      this.userInfo.mobile.length === environment.mobileDigit && this.userInfo.dob !== '' && this.userInfo.sex !== '' &&
      this.userInfo.password.length >= environment.passwordMinLength &&
      this.userInfo.password.length <= environment.passwordMaxLength &&
      this.userInfo.password === this.password2;
  }
}
