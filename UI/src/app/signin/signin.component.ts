import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonUtilityService } from '../common-utility.service';
import { SigninService } from './signin.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NotificationObject } from '../i2h-objects';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signInForm: FormGroup;
  inProgress = false;
  notification = new NotificationObject();
  enableSignInBtn: boolean;
  emailHasContent: boolean;

  constructor(
    private commonUtilityService: CommonUtilityService,
    private signinService: SigninService,
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
    this.inProgress = true;
    const params = this.signInForm.value;
    if (params.email && (params.password || params.otp)) {
      this.signinService.signIn(params).subscribe( (res) => {
        this.inProgress = false;
        if (res && res.status === 200) {
          this.router.navigate(['/account']);
        } else {
          this.commonUtilityService.setNotificationObject(this.notification, 'error', 'Wrong Password / OTP');
        }
      },
      (err: HttpErrorResponse) => {
          this.inProgress = false;
          if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            console.log('An error occurred:', err.error.message);
          } else {
            this.commonUtilityService.setNotificationObject(this.notification, 'error', err.error.errorMessage);
            console.log(`Backend returned code ${err.status}, body was: ${JSON.stringify(err.error)}`);
          }
      });
    } else {
      this.inProgress = false;
      this.commonUtilityService.setNotificationObject(this.notification, 'error', 'Enter Password / mailed OTP');
    }
  }
  mailOTP() {
    const email = this.signInForm.value.email;
    if (email) {
      this.signinService.mailOTP({'email': email}).subscribe((res) => {
        if (res.status === 200) {
          this.commonUtilityService.setNotificationObject(this.notification, 'success', 'OTP sent to your mail');
        }
        this.inProgress = false;
      });
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
  enableOTPButton() {
    if (this.signInForm.value.email.trim() !== '' && this.signInForm.controls.email.status === 'VALID') {
      this.emailHasContent = true;
    } else {
      this.emailHasContent = false;
    }
  }
  enableSignInButton() {
    const formValue = this.signInForm.value;
    if (this.emailHasContent &&
      (formValue.otp.trim().length === environment.otpDigit ||
      (formValue.password.length >= environment.passwordMinLength && formValue.password.length <= environment.passwordMaxLength))) {
      this.enableSignInBtn = true;
    } else {
      this.enableSignInBtn = false;
    }
  }
}
