import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthenticationService, TokenPayload, UserDetails } from '../authentication.service';
import { CommonUtilityService } from '../common-utility.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NotificationObject } from '../i2h-objects';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
  userInfo: UserDetails;
  componentIcon = 'fa-user-circle-o';
  subscription: Subscription;

  constructor(
    private auth: AuthenticationService,
    private commonUtilityService: CommonUtilityService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userInfo = this.auth.getLoggedInUser();
    console.log(this.userInfo);
    this.subscription = this.commonUtilityService.getData()
    .subscribe(x => {
      this.componentIcon = x;
    });
  }

  ngOnInit() {
    console.log('setngs pg', this.componentIcon);
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
