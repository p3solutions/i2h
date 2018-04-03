import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload, UserDetails } from '../authentication.service';
import { CommonUtilityService } from '../common-utility.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NotificationObject } from '../i2h-objects';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  userInfo: UserDetails;

  constructor(
    private auth: AuthenticationService,
    private commonUtilityService: CommonUtilityService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userInfo = this.auth.getLoggedInUser();
    console.log(this.userInfo);
  }

  ngOnInit() {
  }

}
