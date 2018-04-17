import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonUtilityService } from '../common-utility.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
  componentIcon: string;
  subscription: Subscription;

  constructor(
    private commonUtilityService: CommonUtilityService
  ) {
    this.subscription = this.commonUtilityService.getData()
    .subscribe(componentUrl => {
      this.setComponentIcon(componentUrl);
    });
  }

  ngOnInit() {
    this.commonUtilityService.handlePageLinkCLicks();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  setComponentIcon(componentUrl) {
    switch (componentUrl) {
      case 'profile':
        this.componentIcon = 'fa-user-circle';
        break;
      case 'address':
        this.componentIcon = 'fa-address-card';
        break;
      case 'dependents':
        this.componentIcon = 'fa-users';
        break;
        case 'compare':
        this.componentIcon = 'fa-bar-chart';
        break;
      default:
        this.componentIcon = 'fa-user-circle-o';
        break;
    }
  }

}
