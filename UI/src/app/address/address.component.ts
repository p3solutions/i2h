import { Component, OnInit, OnDestroy, Output, Input, EventEmitter } from '@angular/core';
import { CommonUtilityService } from '../common-utility.service';
import { UserDetails, NotificationObject } from '../i2h-objects';
import { UserInfoService } from '../userinfo.service';
import { stateList, tagSet } from '../hardcoded-collection';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit, OnDestroy {
  componentUrl = 'address';
  // tag = '';
  // name = '';
  // contact = '';
  // address = '';
  // city = '';
  // pincode = '';
  // locality = '';
  // state = '';
  // landmark = '';
  // altContact = '';
  // enableAddBtn = false;
  // showTemplate = false;
  addressInfo: any = []; // parent to child
  // tagSet = tagSet;
  // tagList = [];
  // stateList = stateList;
  // addProgress = false;
  selectedAddress: any = null;
  deleteProgress = false;
  delNotif = new NotificationObject();
  delCssClass = 'del-address';
  editCssClass = 'edit-address';
  selectedAddressObj: any; // parent to child
  @Input() isDependentView: any;
  @Output() defaultAddressChange = new EventEmitter<boolean>(); // child to parent
  @Output() backToDependentViewChange = new EventEmitter<boolean>(); // child to parent

  constructor(
    private commonUtilityService: CommonUtilityService,
    private userInfoService: UserInfoService
  ) { }

  ngOnInit() {
    if (!this.isDependentView) {
      this.commonUtilityService.sendData(this.componentUrl);
      this.getAddress();
    }
    console.log('isDependentView', this.isDependentView);
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
  allowOnlyNumbers(e) {
    this.commonUtilityService.allowOnlyNumbers(e);
  }
  pasteOnlyNumbers(e) {
    this.commonUtilityService.pasteOnlyNumbers(e);
  }

  onAddressChanged(isAddressChanged) { // child to parent
    console.log('onAddressChanged', isAddressChanged);
    if (isAddressChanged) {
      this.getAddress();
    }
  }
  onSelectedAddressChanged(isSelectedAddressChanged) {
    console.log('isSelectedAddressChanged', isSelectedAddressChanged);
    if (isSelectedAddressChanged) {
      this.resetSelectedAddress();
      this.getAddress(); // fetch latest address to refresh to show latest default address
    }
  }
  passSelectedAddress(addressObj, isMakeDefault) {
    this.selectedAddressObj = { 'addressObj': addressObj, 'isMakeDefault': isMakeDefault };
    // console.log('passing selectedAddressObj', this.selectedAddressObj);
    this.selectedAddress = addressObj;
    this.selectedAddress.css = this.editCssClass;
  }
  getAddress() {
    this.userInfoService.getAddress().subscribe((res) => {
      if (res && res.status === 'success') {
        const addressList = res.address;
        if (addressList) {
          this.addressInfo = addressList;
          // this.setPotentialTags();
        }
      }
    });
  }

  confirmDelAddress(addressObj) {
    // this.resetAddressForm();
    this.selectedAddress = addressObj;
    this.selectedAddress.css = this.delCssClass;
  }
  deleteAddress() {
    this.deleteProgress = true;
    const id = this.selectedAddress.id;
    this.userInfoService.deleteAddress(id).subscribe((res) => {
      if (res && res.status === 'success') {
        for (let i = 0; i < this.addressInfo.length; i++) { // id may not be in order so iterate full
          if (this.addressInfo[i].id === id) {
            const makeFirstAddressDefault = this.addressInfo[i].default;
            this.addressInfo.splice(i, 1);
            if (makeFirstAddressDefault) {
              this.makeDefault(this.addressInfo[0].id);
            }
            this.delNotif = this.commonUtilityService.setNotificationObject('success', res.message);
            setTimeout(function () {
              const cancelBtn: Element = document.querySelector('#confirmDeleteModal .cancel');
              const btn = <HTMLButtonElement>cancelBtn;
              btn.click();
            }, 1500);
            this.resetSelectedAddress();
            break;
          }
        }
        this.deleteProgress = false;
        // this.setPotentialTags();
      } else {
        this.deleteProgress = false;
        this.delNotif = this.commonUtilityService.setNotificationObject('error', res.message);
      }
    });
  }
  closeDelNotif() {
    this.resetSelectedAddress();
    this.delNotif = new NotificationObject();
  }

  makeDefault(id) {
    // this.resetAddressForm();
    let addressObj: any = {};
    for (let i = 0; i < this.addressInfo.length; i++) {
      if (this.addressInfo[i].id === id) {
        addressObj = this.addressInfo[i];
        break;
      }
    }
    addressObj.default = true;
    this.passSelectedAddress(addressObj, true);
    // this.editAddress(addressObj, true);
    // this.addAdress(true);
  }
  closeDelModal() {
    this.resetSelectedAddress();
  }
  resetSelectedAddress() {
    this.selectedAddress = null;
  }
  selectDefaultAddress(address) {
    this.defaultAddressChange.emit(address);
    // console.log('selected DefaultAddress', address);
  }
  backToDependentView() {
    this.backToDependentViewChange.emit(true);
  }
}
