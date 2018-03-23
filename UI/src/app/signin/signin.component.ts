import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonUtilityService } from '../common-utility.service';
import { MailerService } from '../mailer.service';
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
  notification: NotificationObject;
  enableSignInBtn: boolean;
  emailHasContent: boolean;

  constructor(
    private auth: AuthenticationService,
    private commonUtilityService: CommonUtilityService,
    private mailerService: MailerService,
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
    const formValue = this.signInForm.value;
    if (formValue.email && (formValue.password || formValue.otp)) {
      const credentials: any = { 'email': formValue.email };
      if (formValue.password.length >= environment.passwordMinLength && formValue.password.length <= environment.passwordMaxLength) {
        credentials.password = formValue.password;
      }
      if (formValue.otp.length >= environment.otpDigit) {
        credentials.otp = formValue.otp.trim();
      }
      this.auth.login(credentials).subscribe((res) => {
        this.inProgress = false;
        if ((res && res.email) || (res.token)) { // existing user with details
          this.router.navigateByUrl('/order');
        } else {
          this.router.navigateByUrl('/account/' + formValue.email);
        }
      },
      (err: HttpErrorResponse) => {
        this.inProgress = false;
        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.log('An error occurred:', err.error.message);
        } else {
          this.notification = this.commonUtilityService.setNotificationObject('error', err.error.message);
          if (!environment.production) { // not for production
            console.log(`Backend returned code ${err.status}, body was: ${JSON.stringify(err.error)}`);
          }
        }
      });
    } else {
      this.inProgress = false;
      this.notification = this.commonUtilityService.setNotificationObject('error', 'Enter Password / mailed OTP');
    }
  }

  mailOTP() {
    const email = this.signInForm.value.email;
    if (email) {
      this.mailerService.mailOTP({'email': email}).subscribe((res) => {
        if (res.status === 200) {
          this.notification = this.commonUtilityService.setNotificationObject('success', 'OTP sent to your mail');
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
  enableOTPButton(e) {
    if (this.signInForm.controls.email.status === 'VALID') {
      this.emailHasContent = true;
      if (e && (e.keyCode === 13 || e.which === 13)) {
        this.mailOTP();
      }
    } else {
      this.emailHasContent = false;
    }
    this.enableSignInButton();
  }
  enableSignInButton() {
    const formValue = this.signInForm.value;
    if (this.signInForm.controls.email.status === 'VALID' &&
      (formValue.otp.trim().length === environment.otpDigit ||
      (formValue.password.length >= environment.passwordMinLength && formValue.password.length <= environment.passwordMaxLength))) {
      this.enableSignInBtn = true;
    } else {
      this.enableSignInBtn = false;
    }
  }
}
