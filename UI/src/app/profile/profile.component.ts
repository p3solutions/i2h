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
  passwordProgress = false;
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
  invalidNewPassword = true;
  invalidConfirmPassword = true;
  invalidOTP = true;
  mismatchPassword = true;
  pswdValidatorLoader = false;

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
  validateNP() {
    const passwordForm = this.changePasswordForm.value;
    if (passwordForm.newPassword.length >= environment.passwordMinLength &&
      passwordForm.newPassword.length <= environment.passwordMaxLength) {
        this.invalidNewPassword = false;
      } else {
        this.invalidNewPassword = true;
      }
      this.checkPasswordMatch();
  }
  validateCP() {
    const passwordForm = this.changePasswordForm.value;
    if (passwordForm.confirmPassword !== '' && passwordForm.newPassword === passwordForm.confirmPassword) {
      this.invalidConfirmPassword = false;
    } else {
      this.invalidConfirmPassword = true;
    }
    this.checkPasswordMatch();
  }
  // change password
  checkPasswordMatch() {
    const passwordForm = this.changePasswordForm.value;
    const msg = this.commonUtilityService.checkPasswordMatch(passwordForm.newPassword, passwordForm.confirmPassword);
    if (msg) {
      this.mismatchPassword = true;
      this.passwordNotif = this.commonUtilityService.setNotificationObject('error', msg);
    } else {
      this.mismatchPassword = false;
    }
    this.enableSavePswd();
  }
  enableSavePswd() {
    if (this.isValid()) {
      this.enableSaveBtn = true;
    } else {
      this.enableSaveBtn = false;
    }
  }
  isValid() {
    return (!this.invalidPassword || !this.invalidOTP) && !this.mismatchPassword;
  }
  validateOldPassword() {
    const passwordForm = this.changePasswordForm.value;
    if (passwordForm.oldPassword.length >= environment.passwordMinLength) {
      this.pswdValidatorLoader = true;
      this.invalidPassword = true;
      this.auth.validatePassword(passwordForm.oldPassword).subscribe( (res) => {
        this.pswdValidatorLoader = false;
        if (res && res.status === 'success') {
          this.invalidPassword = false;
          this.enableSavePswd();
        } else {
          this.invalidPassword = true;
          this.passwordNotif = this.commonUtilityService.setNotificationObject('error', 'Invalid Old Password');
        }
      });
    } else {
      this.invalidPassword = true;
      this.enableSavePswd();
      this.passwordNotif = this.commonUtilityService.setNotificationObject('error', 'Invalid Old Password');
      this.pswdValidatorLoader = false;
    }
  }

  validateOTP() {
    const passwordForm = this.changePasswordForm.value;
    if (passwordForm.otp.length === environment.otpDigit) {
      this.invalidOTP = false;
    } else {
      this.invalidOTP = true;
      this.passwordNotif = this.commonUtilityService.setNotificationObject('error', 'Invalid OTP');
    }
    this.enableSavePswd();
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
  updatePassword() {
    this.passwordProgress = true;
    const passwordForm = this.changePasswordForm.value;
    const param: any = { newPassword: passwordForm.newPassword };
    if (passwordForm.oldPassword) {
      param.password = passwordForm.oldPassword;
    }
    if (passwordForm.otp) {
      param.otp = passwordForm.otp;
    }
    this.auth.validateThenSetPassword(param).subscribe( (res) => {
      if (res && res.status === 'success') {
        this.passwordNotif = this.commonUtilityService.setNotificationObject('success', res.message);
        setTimeout(function () {
          document.getElementById('cancel').click();
        }, 1500);
      } else {
        this.passwordNotif = this.commonUtilityService.setNotificationObject('error', res.message);
      }
      this.passwordProgress = false;
    });
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
}
