import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserDetails } from '../authentication.service';
import { UserInfoService } from '../userinfo.service';
import { CommonUtilityService } from '../common-utility.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userDetails: UserDetails;

  constructor(
    private auth: AuthenticationService,
    private userInfoService: UserInfoService,
    private commonUtilityService: CommonUtilityService
  ) { }

  ngOnInit() {
    const loggedInUser = this.auth.getLoggedInUser();
    if (loggedInUser) {
      this.getUserInfo();
    }
  }
  getUserInfo() {
    console.log('fetching User');
    this.auth.profile().subscribe(user => {
      console.log('fetched User', user);
      this.userDetails = user;
    }, (err) => {
      console.error('usr profl -> ', err);
       this.commonUtilityService.getErrorNotification(err);
    });
  }

  logOut() {
    this.auth.logout();
  }
}
