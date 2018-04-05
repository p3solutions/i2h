import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonUtilityService } from '../common-utility.service';

@Component({
  selector: 'app-dependents',
  templateUrl: './dependents.component.html',
  styleUrls: ['./dependents.component.css']
})
export class DependentsComponent implements OnInit, OnDestroy {
  componentIcon = 'fa-users';

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
