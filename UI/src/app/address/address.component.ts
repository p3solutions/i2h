import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonUtilityService } from '../common-utility.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit, OnDestroy {
  componentIcon = 'fa-address-card';

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
