import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonUtilityService } from '../common-utility.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
  componentIcon = 'fa-user-circle-o';
  subscription: Subscription;

  constructor(
    private commonUtilityService: CommonUtilityService
  ) {
    this.subscription = this.commonUtilityService.getData()
    .subscribe(x => {
      this.componentIcon = x;
    });
  }

  ngOnInit() {
    this.commonUtilityService.handlePageLinkCLicks();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }


}
