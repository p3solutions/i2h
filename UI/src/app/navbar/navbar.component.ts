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
    this.auth.profile().subscribe(user => {
      this.userDetails = user;
    }, (err) => {
       this.commonUtilityService.getErrorNotification(err);
    });
  }
  reloadNavbar() {
    this.getUserInfo();
  }
  logOut() {
    this.auth.logout();
  }
}
