import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonUtilityService } from '../common-utility.service';
import { NotificationObject } from '../i2h-objects';
import { UserInfoService } from '../userinfo.service';

@Component({
  selector: 'app-dependents',
  templateUrl: './dependents.component.html',
  styleUrls: ['./dependents.component.css']
})
export class DependentsComponent implements OnInit, OnDestroy {
  componentUrl = 'dependents';
  key = 'name';
  reverse = false;
  // dependentInfo: any = []; // parent to child
  delCssClass = 'del-address';
  editCssClass = 'edit-address';
  selectedDependentObj: any;
  deleteProgress = false;
  delNotif = new NotificationObject();
  dependentInfo = [
    {
      'id': '1',
      'name': 'Mr X',
      'age': '60',
      'sex': 'Male',
      'relationship': 'Father'
    },
    {
      'id': '2',
      'name': 'Master xx',
      'age': '1',
      'sex': 'Male',
      'relationship': 'Son'
    },
    {
      'id': '3',
      'name': 'Mrs XY',
      'age': '58',
      'sex': 'Female',
      'relationship': 'Mother'
    },
    {
      'id': '4',
      'name': 'Mrs xy',
      'age': '25',
      'sex': 'Female',
      'relationship': 'Wife'
    }
  ];

  constructor(
    private commonUtilityService: CommonUtilityService,
    private userInfoService: UserInfoService
  ) { }

  ngOnInit() {
    this.commonUtilityService.sendData(this.componentUrl);
    this.getDependent();
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

  getDependent() {
    this.userInfoService.getDependent().subscribe((res) => {
      console.log(res);
      if (res && res.status === 'success') {
        const dependentList = res.Dependent;
        if (dependentList) {
          this.dependentInfo = dependentList;
        }
      }
    });
  }
  editDependentReady(dependent) {
    this.selectedDependentObj = dependent;
    this.selectedDependentObj.css = this.editCssClass;
  }

  delDependentReady(dependent) {
    this.selectedDependentObj = dependent;
    this.selectedDependentObj.css = this.delCssClass;
    console.log(this.selectedDependentObj);
  }
  deleteDependent() {
    this.deleteProgress = true;
    const id = this.selectedDependentObj.id;
    this.userInfoService.deleteDependent(id).subscribe((res) => {
      if (res && res.status === 'success') {
        for (let i = 0; i < this.dependentInfo.length; i++) { // id may not be in order so iterate full
          if (this.dependentInfo[i].id === this.selectedDependentObj.id) {
            this.dependentInfo.splice(i, 1);
            this.delNotif = this.commonUtilityService.setNotificationObject('success', res.message);
            setTimeout(function () {
              const cancelBtn: Element = document.querySelector('#confirmDeleteModal .cancel');
              const btn = <HTMLButtonElement>cancelBtn;
              btn.click();
            }, 1500);
            break;
          }
        }
        this.deleteProgress = false;
      } else {
        this.deleteProgress = false;
        this.delNotif = this.commonUtilityService.setNotificationObject('error', res.message);
      }
    });
  }
  onDependentChangedInChild(isDependentChanged) {
    console.log(isDependentChanged, 'isDependentChanged');
 }

  onSelectedDependentChangedInChild(isSelectedDependentChanged) {
    console.log(isSelectedDependentChanged, 'isSelectedDependentChanged');
    // call getDependent() to update dependentList
  }
  closeDelModal() {
    this.resetSelectedDependent();
  }
  resetSelectedDependent() {
    this.selectedDependentObj = null;
    console.log('resetSelectedDependent called in dependent');
  }
}
