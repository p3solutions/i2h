import { Component, OnInit, Input, Output, SimpleChanges, OnChanges, EventEmitter } from '@angular/core';
import { CommonUtilityService } from '../common-utility.service';
import { NotificationObject } from '../i2h-objects';
import { relationshipList } from '../hardcoded-collection';
import { UserInfoService } from '../userinfo.service';

@Component({
  selector: 'app-add-edit-dependent',
  templateUrl: './add-edit-dependent.component.html',
  styleUrls: ['./add-edit-dependent.component.css']
})
export class AddEditDependentComponent implements OnInit, OnChanges {
  id = '';
  name = '';
  age = '';
  dob = '';
  sex = '';
  relation = '';
  invalidDOB = false;
  addProgress = false;
  enableSaveBtn = false;
  dependentInfo: any = [];
  relationshipList = relationshipList;
  delCssClass = 'del-address';
  editCssClass = 'edit-address';
  saveNotif = new NotificationObject();
  private today = (new Date()).toISOString().split('T')[0];
  selectedDependent: any = null;
  @Input() modifiedDependentInfo: any;
  @Output() dependentChange = new EventEmitter<boolean>(); // child to parent
  @Output() backToDependentView = new EventEmitter<boolean>(); // child to parent
  @Input() passedSelectedDependentObj: any;  // parent to child
  @Output() selectedDependentChange = new EventEmitter<boolean>(); // child to parent
  dependentAddressView = false;
  defaultAddress: any;
  addressInfo: any;

  constructor(
    private commonUtilityService: CommonUtilityService,
    private userInfoService: UserInfoService
  ) { }

  ngOnInit() {
    if (!this.defaultAddress) {
      this.loadDefaultAddress();
    }
  }

  ngOnChanges(change: SimpleChanges) {
    if (change.modifiedDependentInfo && change.modifiedDependentInfo.currentValue) {
      this.dependentInfo = change.modifiedDependentInfo.currentValue;
    }
    if (change.passedSelectedDependentObj && change.passedSelectedDependentObj.currentValue) {
      const currentVal = change.passedSelectedDependentObj.currentValue;
      this.selectedDependent = currentVal;
      this.updateDependentReady();
      this.enableSaveButton(null);
    }
  }
  handleLabelName(e) {
    this.commonUtilityService.handleInputLabelName(e);
  }

  loadDefaultAddress() {
    this.userInfoService.getAddress().subscribe((res) => {
      if (res && res.status === 'success') {
        const addressList = res.address;
        if (addressList) {
          this.addressInfo = addressList;
          this.addressInfo.forEach(address => {
            if (address.default) {
              this.defaultAddress = address;
              return false;
            }
          });
        }
      }
    });
  }
  updateDependentReady() {
    this.id = this.selectedDependent.id;
    this.name = this.selectedDependent.name;
    this.age = this.selectedDependent.age;
    this.sex = this.selectedDependent.sex;
    this.dob = this.selectedDependent.dob;
    this.relation = this.selectedDependent.relation;
    this.defaultAddress = this.selectedDependent.address;
    if (!this.defaultAddress) {
      this.loadDefaultAddress();
    }
  }

  validateDOB() {
    const msg = this.commonUtilityService.validateDOB(this.dob);
    if (msg) {
      this.invalidDOB = true;
      this.saveNotif = this.commonUtilityService.setNotificationObject('error', msg);
    } else {
      this.invalidDOB = false;
      this.enableSaveButton(null);
    }
  }
  enableSaveButton(e) {
    if (this.name !== '' && this.relation !== '' &&
        this.dob !== '' && !this.invalidDOB &&
        this.sex !== '' && this.defaultAddress
    ) {
      this.enableSaveBtn = true;
      if (e && e.keyCode === 13) {
        this.addUpdateDependent();
      }
    } else {
      this.enableSaveBtn = false;
    }
    console.log(this.name, this.dob, this.sex, this.defaultAddress.tag, !this.invalidDOB, this.relation);
  }

  addUpdateDependent() {
    console.log('selectedDependent->', this.selectedDependent, this.dependentInfo);
    this.addProgress = true;
    const dependentObj: any = {
      // id: this.id,
      name: this.name,
      address: this.defaultAddress,
      sex: this.sex,
      relation: this.relation,
      age: this.age,
      dob: this.dob
    };
    if (this.selectedDependent) {
      dependentObj.id = this.selectedDependent.id;
      this.userInfoService.updateDependent(dependentObj).subscribe((res) => {
        if (res && res.status === 'success') {
          const cancelBtn: Element = document.querySelector('#addEditDependentModal .cancel');
          const btn = <HTMLButtonElement>cancelBtn;
          btn.click();
        }
        this.addProgress = false;
      });
    } else {
      this.userInfoService.addDependent(dependentObj).subscribe((res) => {
        if (res && res.status === 'success') {
          dependentObj.id = res.lastObjId;
          this.dependentInfo.push(dependentObj);
          this.resetDependentForm();
          const cancelBtn: Element = document.querySelector('#addEditDependentModal .cancel');
          const btn = <HTMLButtonElement>cancelBtn;
          btn.click();
        }
        this.addProgress = false;
      });
    }
  }

  closeAddEditModal() {
    this.resetDependentForm();
    this.resetselectedDependent();
  }
  resetDependentForm() {
    if (!this.dependentAddressView) {
    this.name = '';
    this.id = '';
    this.age = '';
    this.sex = '';
    this.dob = '';
    this.relation = '';
    this.loadDefaultAddress();
    }
  }

  closeSaveNotif() {
    this.saveNotif = new NotificationObject();
  }

  resetselectedDependent() {
    if (!this.dependentAddressView) {
      this.selectedDependent = null;
      this.selectedDependentChange.emit(true);
      this.defaultAddress = null;
    }
  }
  showAddressDiv() {
    this.dependentAddressView = true;
  }
  onPassedDefaultAddress(passedDefaultAddress) {
    this.defaultAddress = passedDefaultAddress;
    this.dependentAddressView = false;
    this.enableSaveButton(null);
  }
  onBackToDependentView() {
    this.dependentAddressView = false;
  }
}
