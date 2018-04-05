import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonUtilityService } from '../common-utility.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit, OnDestroy {
  componentIcon = 'fa-bar-chart';

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
