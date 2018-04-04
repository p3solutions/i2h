import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonUtilityService } from '../common-utility.service';
import { UserInfoService } from '../userinfo.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NotificationObject } from '../i2h-objects';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signInForm: FormGroup;
  inProgress = false;
  mailProgress = false;
  notification = new NotificationObject();
  enableSignInBtn: boolean;
  emailHasContent: boolean;
  maxCountOTP = environment.maxCountOTP;
  otpCount = 1;
  constructor(
    private auth: AuthenticationService,
    private commonUtilityService: CommonUtilityService,
    private userInfoService: UserInfoService,
    private router: Router
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.signInForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.minLength(environment.passwordMinLength)]),
      otp: new FormControl('', [Validators.minLength(environment.otpDigit)])
    });
  }

  onSignIn() {
    const formValue = this.signInForm.value;
    if (formValue.email && (formValue.password || formValue.otp) && !this.inProgress) {
      const credentials: any = { 'email': formValue.email };
      if (formValue.password.length >= environment.passwordMinLength && formValue.password.length <= environment.passwordMaxLength) {
        credentials.password = formValue.password;
      }
      if (formValue.otp.length >= environment.otpDigit) {
        credentials.otp = formValue.otp.trim();
      }
      this.inProgress = true;
      this.auth.login(credentials).subscribe((res) => {
        this.inProgress = false;
        if (res && res.hasUserInfo) { // existing user with details
          this.router.navigateByUrl(this.auth.getOrderUrl());
        } else {
          this.router.navigateByUrl(this.auth.getRegisterUrl(formValue.email));
        }
      },
      (err: HttpErrorResponse) => {
        this.inProgress = false;
        this.notification = this.commonUtilityService.getErrorNotification(err);
      });
    } else {
      this.inProgress = false;
      this.notification = this.commonUtilityService.setNotificationObject('error', 'Enter Password / mailed OTP');
    }
  }

  disableOtpBtnHandling() {
    const otpBtn = <HTMLButtonElement>document.getElementById('otp-btn');
    otpBtn.disabled = true;
    setTimeout(function () { otpBtn.disabled = false; }, environment.otpDisableTime);
    this.notification = this.commonUtilityService.setNotificationObject('error', 'OTP sent limit reached');
  }

  mailOTP() {
    const email = this.signInForm.value.email;
    if (email && !this.mailProgress) {
      this.mailProgress = true;
      if (this.otpCount <= this.maxCountOTP) {
        this.userInfoService.mailOTP({'email': email}).subscribe((res) => {
          this.mailProgress = false;
          if (res.status === 'success') {
            this.otpCount++;
            this.notification = this.commonUtilityService.setNotificationObject('success', 'OTP sent to your mail');
          }
        },
        (err: HttpErrorResponse) => {
          this.mailProgress = false;
          this.notification = this.commonUtilityService.getErrorNotification(err);
        });
      } else {
        this.mailProgress = false;
        this.disableOtpBtnHandling();
      }
    }
  }
  closeNotification() {
    this.notification = new NotificationObject();
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
  enableOTPButton(e) {
    if (this.signInForm.controls.email.status === 'VALID') {
      this.emailHasContent = true;
      if (e && (e.keyCode === 13 || e.which === 13)) {
        this.mailOTP();
      }
    } else {
      this.emailHasContent = false;
    }
    this.enableSignInButton(null);
  }
  enableSignInButton(e) {
    const formValue = this.signInForm.value;
    if (this.signInForm.controls.email.status === 'VALID' &&
      (formValue.otp.trim().length === environment.otpDigit ||
      (formValue.password.length >= environment.passwordMinLength && formValue.password.length <= environment.passwordMaxLength))) {
      this.enableSignInBtn = true;
      if (e && (e.keyCode === 13 || e.which === 13)) {
        this.onSignIn();
      }
    } else {
      this.enableSignInBtn = false;
    }
  }
}
