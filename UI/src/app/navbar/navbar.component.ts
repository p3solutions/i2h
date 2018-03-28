import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { UserInfoService } from '../userinfo.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  info: any;

  constructor(
    private auth: AuthenticationService,
    private userInfoService: UserInfoService
  ) { }

  ngOnInit() {
    console.log('navbar loaded', this.auth.getUserDetails() );
  }
  getUserInfo() {
    const email = this.auth.getLoggedInUserEmail();
    this.userInfoService.getUserInfo(email).subscribe((res) => {
      // this.info = res.data;
      console.log(res, '<-userInfo');
    });
  }

  logOut() {
    this.auth.logout();
  }
}
