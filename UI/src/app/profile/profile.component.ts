import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonUtilityService } from '../common-utility.service';
import { UserDetails, AuthenticationService } from '../authentication.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  componentIcon = 'fa-user-circle';
  userInfo: UserDetails;
  loaderImage = environment.loaderImage;

  constructor(
    private auth: AuthenticationService,
    private commonUtilityService: CommonUtilityService
  ) {
    console.log('prof loaded');
   }

  ngOnInit() {
    this.commonUtilityService.sendData(this.componentIcon);
    this.auth.profile().subscribe(user => {
      this.userInfo = user;
      console.log(this.userInfo);
    }, (err) => {
      this.commonUtilityService.getErrorNotification(err);
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
}
