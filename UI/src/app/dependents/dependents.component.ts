import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonUtilityService } from '../common-utility.service';

@Component({
  selector: 'app-dependents',
  templateUrl: './dependents.component.html',
  styleUrls: ['./dependents.component.css']
})
export class DependentsComponent implements OnInit, OnDestroy {
  componentUrl = 'dependents';
  key = 'name';
  reverse = false;
  games = [
    {
      'id': '1',
      'name': 'Mr X',
      'age': '60',
      'gender': 'Male',
      'relationship': 'Father'
    },
    {
      'id': '2',
      'name': 'Master xx',
      'age': '1',
      'gender': 'Male',
      'relationship': 'Son'
    },
    {
      'id': '3',
      'name': 'Mrs XY',
      'age': '58',
      'gender': 'Female',
      'relationship': 'Mother'
    },
    {
      'id': '4',
      'name': 'Mrs xy',
      'age': '25',
      'gender': 'Female',
      'relationship': 'wife'
    },
  ];
  constructor(
    private commonUtilityService: CommonUtilityService
  ) { }

  ngOnInit() {
    this.commonUtilityService.sendData(this.componentUrl);
  }

  sendData() {
    this.commonUtilityService.sendData(this.componentUrl);
  }

  ngOnDestroy() {
    // clear message
    this.commonUtilityService.clearData();
  }

  clearData() {
    // clear message
    this.commonUtilityService.clearData();
  }

  handleLabelName(e) {
    this.commonUtilityService.handleInputLabelName(e);
  }
  // sorting
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  addUpdateDependents() {

  }

}
