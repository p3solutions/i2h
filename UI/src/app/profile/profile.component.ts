import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonUtilityService } from '../common-utility.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  componentIcon = 'fa-user-circle';

  constructor(
    private commonUtilityService: CommonUtilityService
  ) { }

  ngOnInit() {
    this.commonUtilityService.sendData(this.componentIcon);
  }

  sendData() {
    this.commonUtilityService.sendData(this.componentIcon);
  }

  ngOnDestroy() {
    // clear message
    this.commonUtilityService.clearData();
  }

  clearData() {
    // clear message
    this.commonUtilityService.clearData();
  }
}
