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
    console.log(this.signInForm, this.signInForm.value);
    if (params.email && (params.password || params.otp)) {
      this.signinService.signIn(params).subscribe( (res) => {
        if (res && res.status === 200) {
          this.inProgress = false;
          this.router.navigate(['/account']);
        }
      },
      (err: HttpErrorResponse) => {
          this.inProgress = false;
          if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            console.log('An error occurred:', err.error.message);
          } else {
            this.notification.message = err.error.errorMessage;
            this.notification.show = true;
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
        console.log(res, 'otp gen');
        this.commonUtilityService.setNotificationObject(this.notification, 'success', 'OTP sent to your mail');
        this.inProgress = false;
      });
    // } else {
    //   this.commonUtilityService.setNotificationObject(this.notification, 'error', 'Enter Email ID');
    //   this.inProgress = false;
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
    console.log(formValue.otp.trim().length, formValue.otp.trim());
    if (this.emailHasContent && (formValue.password.trim() !== '' || formValue.otp.trim() !== '')) {
      this.enableSignInBtn = true;
    } else {
      this.enableSignInBtn = false;
    }
  }
}
