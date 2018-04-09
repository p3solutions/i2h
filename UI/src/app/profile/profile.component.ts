import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonUtilityService } from '../common-utility.service';
import { UserDetails, AuthenticationService } from '../authentication.service';
import { environment } from '../../environments/environment';
import { NotificationObject } from '../i2h-objects';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

export interface ChangePassword {
  userId: string;
  oldPassword: string;
  newPassword: string;
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
  pswdNotifi = new NotificationObject();
  invalidDOB = false;
  enableUpdateBtn: boolean;
  changepassword: ChangePassword;
  changePasswordForm: FormGroup;

  constructor(
    private auth: AuthenticationService,
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
  changeUserPassword() {
    //
  }
  closeErrorMsg() {
    this.pswdNotifi = null;
  }
  closeNotification() {
    this.notification = new NotificationObject();
  }
}
