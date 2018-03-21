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
  password2: any;

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
  enableSaveButton() {
    console.log(this.fname, this.lname, this.dob, this.mobile, this.password, this.password2);
    // this.fname.trim() !== '' || this.lname.trim() !== '' || this.mobile.trim() !== '' ||
    if (this.password !== '' && this.password.length >= environment.passwordMinLength &&
      this.password.length <= environment.passwordMaxLength &&
      this.password === this.password2) {
      this.enableSaveBtn = true;
    } else {
      this.enableSaveBtn = false;
    }
  }

  onSave() {

  }
}
