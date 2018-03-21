import { Component, OnInit } from '@angular/core';
import { CommonUtilityService } from '../common-utility.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NotificationObject } from '../i2h-objects';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SigninService } from '../signin/signin.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  inProgress = false;
  enableSaveBtn: boolean;
  fname: any = '';
  lname: any = '';
  dob: any = '';
  mobile: any = '';
  password: any = '';
  password2: any = '';
  sex: any = '';
  notification: NotificationObject;

  constructor(
    private commonUtilityService: CommonUtilityService,
    private signinService: SigninService,
    private router: Router
  ) { }

  ngOnInit() {
    // check if user-info avilable redirect to order pg
    // this.router.navigate(['/order']);
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

  enableSaveButton(type) {
    // needs validation & notification https://docs.angularjs.org/api/ng/input/input%5Bdate%5D
    console.log(type, this.fname, this.lname, this.dob, this.mobile, this.password, this.password2, this.sex);
    if (this.fname.trim() !== '' && this.lname.trim() !== '' &&
      this.mobile.length === environment.mobileDigit && this.dob !== '' && this.sex !== '' &&
    this.password.length >= environment.passwordMinLength &&
    this.password.length <= environment.passwordMaxLength &&
    this.password === this.password2) {
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
    const userInfo = { fname: this.fname, lname: this.lname, dob: this.dob, sex: this.sex, mobile: this.mobile, password: this.password };
    this.signinService.saveUserInfo(userInfo).subscribe((res) => {
      this.inProgress = false;
      console.log(res);
      if (res && res.status === 200) {
        this.router.navigate(['/order']);
      }
    });
  }
}
