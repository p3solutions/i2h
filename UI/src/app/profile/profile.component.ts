import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonUtilityService } from '../common-utility.service';
import { UserDetails, AuthenticationService } from '../authentication.service';
import { environment } from '../../environments/environment';
import { NotificationObject } from '../i2h-objects';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { UserInfoService } from '../userinfo.service';

export interface ChangePassword {
  userId: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  componentIcon = 'fa-user-circle';
  userInfo: UserDetails;
  initialVal: UserDetails;
  modifiedUserInfo: any = new Object();
  private today = (new Date()).toISOString().split('T')[0];
  inProgress = false;
  notification = new NotificationObject();
  passwordNotif = new NotificationObject();
  mailProgress = false;
  maxCountOTP = environment.maxCountOTP;
  otpCount = 1;
  invalidDOB = false;
  enableUpdateBtn: boolean;
  changePassword: ChangePassword;
  changePasswordForm: FormGroup;
  enableSaveBtn = false;
  invalidPassword = true;
  invalidOTP = true;
  mismatchPassword = true;
  pswdValidatorLoader = false;
  otpValidatorLoader = false;

  constructor(
    private auth: AuthenticationService,
    private userInfoService: UserInfoService,
    private commonUtilityService: CommonUtilityService
  ) { }

  ngOnInit() {
    this.commonUtilityService.sendData(this.componentIcon);
    this.auth.profile().subscribe(user => {
      this.initialVal = JSON.parse(JSON.stringify(user));
      this.userInfo = user;
      this.modifiedUserInfo._id = user._id;
      this.modifiedUserInfo.email = user.email;
    }, (err) => {
      this.commonUtilityService.getErrorNotification(err);
    });
    this.createForm();
  }

  createForm() {
    this.changePasswordForm = new FormGroup({
      otp: new FormControl('', [Validators.required]),
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    });
  }
  sendData() {
    this.commonUtilityService.sendData(this.componentIcon);
  }

  // clear message
  ngOnDestroy() {
    this.commonUtilityService.clearData();
  }

  // clear message
  clearData() {
    this.commonUtilityService.clearData();
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
  validateDOB() {
    const msg = this.commonUtilityService.validateDOB(this.userInfo.dob);
    if (msg) {
      this.invalidDOB = true;
      this.notification = this.commonUtilityService.setNotificationObject('error', msg);
    } else {
      this.invalidDOB = false;
      // this.enableUpdateButton(e);
    }
  }
  isModified() {
    return !(JSON.stringify(this.initialVal) === JSON.stringify(this.userInfo));
  }
  enableUpdateButton() {
    if (this.validateValues() && this.isModified()) {
      this.enableUpdateBtn = true;
    } else {
      this.enableUpdateBtn = false;
    }
  }
  validateValues() {
    return this.userInfo.fname.trim() !== '' &&
      // this.userInfo.lname.trim() !== '' &&
      this.userInfo.mobile.length === environment.mobileDigit &&
      this.userInfo.dob !== '' && !this.invalidDOB &&
      this.userInfo.sex !== ''; // &&
  }
  modifyUserInfo() {
    for (const [key, value] of Object.entries(this.initialVal)) {
      if (value !== this.userInfo[key]) {
        this.modifiedUserInfo[key] = this.userInfo[key];
      }
    }
  }
  updateUserInfo() {
    this.enableUpdateBtn = false;
    this.modifiedUserInfo = {};
    this.modifiedUserInfo._id = this.userInfo._id;
    this.modifiedUserInfo.email = this.userInfo.email;
    // update Navbar compo
    document.getElementById('reload-navbar').click();
    // set initial values to modified userInfo
    for (const [key, value] of Object.entries(this.userInfo)) {
      this.initialVal[key] = value;
    }
  }
  onUpdate() {
    this.inProgress = true;
    this.modifyUserInfo();
    this.auth.updateUser(this.modifiedUserInfo).subscribe((res) => {
      this.inProgress = false;
      if (res && res.status) { // existing user with details
        this.updateUserInfo();
        this.notification = this.commonUtilityService.setNotificationObject('success', res.message);
      }
    }, (err) => {
      console.error(err);
      this.inProgress = false;
      this.notification = this.commonUtilityService.setNotificationObject('error', err.error.message);
    });
  }

  // change password
  checkPasswordMatch() {
    const passwordForm = this.changePasswordForm.value;
    console.log(passwordForm, passwordForm.oldPassword, passwordForm.confirmPassword);
    // const msg = this.commonUtilityService.checkPasswordMatch(this.oldPassword, this.password2);
    // if (msg) {
    //   this.mismatchPassword = true;
    //   this.notification = this.commonUtilityService.setNotificationObject('error', msg);
    // } else {
    //   this.mismatchPassword = false;
    //   this.enableSavePswd();
    // }
  }
  enableSavePswd() {
    if (this.isValid()) {
      this.enableSaveBtn = true;
    } else {
      this.enableSaveBtn = false;
    }
  }
  isValid() {
    return (!this.invalidOTP || !this.invalidPassword) &&
      !this.mismatchPassword;
  }
  validateOldPassword() {
    const passwordForm = this.changePasswordForm.value;
    console.log(passwordForm);
    if (passwordForm.oldPassword.length >= environment.passwordMinLength) {
      this.pswdValidatorLoader = true;
      this.auth.validatePassword(passwordForm.oldPassword).subscribe( (res) => {
        console.log(res);
        this.pswdValidatorLoader = false;
        if (res && res.status === 'success') {
          this.invalidPassword = false;
        } else {
          this.invalidPassword = true;
          this.passwordNotif = this.commonUtilityService.setNotificationObject('error', 'Old Password is wrong');
        }
      });
    } else {
      this.invalidPassword = true;
      this.passwordNotif = this.commonUtilityService.setNotificationObject('error', 'Old Password is wrong');
      this.pswdValidatorLoader = false;
    }
  }
  updatePassword() {
    this.inProgress = true;
    //
  }
  closeNotification() {
    this.notification = new NotificationObject();
  }
  closePasswordNotif() {
    this.passwordNotif = new NotificationObject();
  }
  disableOtpBtnHandling() {
    this.commonUtilityService.disableOTP();
    this.passwordNotif = this.commonUtilityService.setNotificationObject('error', 'OTP sent limit reached');
  }

  validateOTP() {

  }
  mailOTP() {
    const user = this.auth.getLoggedInUser();
    if (user) {
      const email = user.email;
      if (email && !this.mailProgress) {
        this.mailProgress = true;
        if (this.otpCount <= this.maxCountOTP) {
          this.userInfoService.mailOTP({ 'email': email }).subscribe((res) => {
            this.mailProgress = false;
            if (res.status === 'success') {
              this.otpCount++;
              this.passwordNotif = this.commonUtilityService.setNotificationObject('success', 'OTP sent to your mail');
            }
          },
            (err: HttpErrorResponse) => {
              this.mailProgress = false;
              this.passwordNotif = this.commonUtilityService.getErrorNotification(err);
            });
        } else {
          this.mailProgress = false;
          this.disableOtpBtnHandling();
        }
      }
    } else {
      this.passwordNotif = this.commonUtilityService.setNotificationObject('error', 'User is logged out');
    }
  }
}
