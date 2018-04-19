import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { UserInfoService } from '../userinfo.service';
import { CommonUtilityService } from '../common-utility.service';
import { NotificationObject } from '../i2h-objects';
import { stateList, tagSet } from '../hardcoded-collection';

@Component({
  selector: 'app-add-edit-address',
  templateUrl: './add-edit-address.component.html',
  styleUrls: ['./add-edit-address.component.css']
})
export class AddEditAddressComponent implements OnInit, OnChanges {
  tag = '';
  name = '';
  contact = '';
  address = '';
  city = '';
  pincode = '';
  locality = '';
  state = '';
  landmark = '';
  altContact = '';
  enableAddBtn = false;
  addressInfo: any = [];
  tagSet = tagSet;
  tagList = [];
  stateList = stateList;
  addProgress = false;
  selectedAddress: any = null;
  deleteProgress = false;
  delNotif = new NotificationObject();
  delCssClass = 'del-address';
  editCssClass = 'edit-address';
  @Input() modifiedAddressInfo: any;
  @Output() addressChange =  new EventEmitter<boolean>();
  @Input() passedSelectedAddressObj: any;
  @Output() selectedAddressChange = new EventEmitter<boolean>();

  constructor(
    private commonUtilityService: CommonUtilityService,
    private userInfoService: UserInfoService
  ) { }

  ngOnInit() {
    this.resetSelectedAddress();
  }

  ngOnChanges(change: SimpleChanges) {
    // console.log(change, 'change detected');
    if (change.modifiedAddressInfo && change.modifiedAddressInfo.currentValue) {
      this.addressInfo = change.modifiedAddressInfo.currentValue;
      this.setPotentialTags();
      // console.log('change.modifiedAddressInfo');
    }
    if (change.passedSelectedAddressObj && change.passedSelectedAddressObj.currentValue) {
      this.editAddress(change.passedSelectedAddressObj.currentValue.addressObj, change.passedSelectedAddressObj.currentValue.isMakeDefault);
      // console.log('change.passedSelectedAddressObj');
    }
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

  getAddress() {
    this.userInfoService.getAddress().subscribe((res) => {
      if (res && res.status === 'success') {
        const addressList = res.address;
        if (addressList) {
          this.addressInfo = addressList;
          this.setPotentialTags();
          this.addressChange.emit(true);
        }
      }
    });
  }

  enableAddButton(e) {
    if (this.name !== '' && this.contact !== '' && this.address !== '' &&
      this.state !== '' && this.pincode !== '' && this.city !== '' && this.locality !== ''
    ) {
      this.enableAddBtn = true;
      if (e.keyCode === 13) {
        this.addAdress(false);
      }
    } else {
      this.enableAddBtn = false;
    }
  }

  showMap() {
    console.log('Google Maps/API still not integrated');
  }

  setPotentialTags() {
    const tags = new Set(this.tagSet);
    this.addressInfo.forEach(address => {
      if (address.tag !== 'Other') {
        tags.delete(address.tag);
      }
    });
    this.tagList = [];
    tags.forEach((tag) => { this.tagList.push(tag); });
  }

  resetTagList() {
    this.tagList = [];
    this.tagSet.forEach((tag) => { this.tagList.push(tag); });
  }
  addAdress(isMakeDefault) {
    this.addProgress = true;
    if (!this.tag) {
      this.tag = (this.addressInfo.length === 0) ? 'Home' : 'Other';
    }
    const addressObj: any = {
      tag: this.tag,
      name: this.name,
      contact: this.contact,
      address: this.address,
      city: this.city,
      pincode: this.pincode,
      locality: this.locality,
      state: this.state,
      landmark: this.landmark,
      altContact: this.altContact,
      default: (this.addressInfo.length === 0) || (this.selectedAddress && this.selectedAddress.default) // first address is always default
    };
    if (this.selectedAddress) {
      addressObj.id = this.selectedAddress.id;
      this.userInfoService.updateAddress(addressObj).subscribe((res) => {
        if (res && res.status === 'success') {
          this.selectedAddressChange.emit(true);
          this.resetSelectedAddress();
          this.resetAddressForm();
          const cancelBtn: HTMLButtonElement = document.querySelector('#addEditAddressModal .cancel');
          cancelBtn.click();
        }
      });
    } else {
      this.userInfoService.addAddress(addressObj).subscribe((res) => {
        if (res && res.status === 'success') {
          addressObj.id = res.lastObjId;
          this.addressInfo.push(addressObj);
          this.resetAddressForm();
          const cancelBtn: HTMLButtonElement = document.querySelector('#addEditAddressModal .cancel');
          cancelBtn.click();
        }
      });
    }
  }

  resetAddressForm() {
    this.addProgress = false;
    this.enableAddBtn = false;
    this.tag = '';
    this.contact = '';
    this.name = '';
    this.address = '';
    this.city = '';
    this.state = '';
    this.locality = '';
    this.landmark = '';
    this.pincode = '';
    this.altContact = '';
    this.setPotentialTags();
  }
  editAddress(addressObj, isMakeDefault) {
    if (!isMakeDefault) {
      this.resetTagList();
    }
    this.selectedAddress = addressObj;
    this.selectedAddress.css = this.editCssClass;
    this.tag = this.selectedAddress.tag;
    this.contact = this.selectedAddress.contact;
    this.name = this.selectedAddress.name;
    this.address = this.selectedAddress.address;
    this.city = this.selectedAddress.city;
    this.state = this.selectedAddress.state;
    this.locality = this.selectedAddress.locality;
    this.landmark = this.selectedAddress.landmark;
    this.pincode = this.selectedAddress.pincode;
    this.altContact = this.selectedAddress.altContact;
    if (isMakeDefault) {
      this.addAdress(true);
    }
  }

  closeDelNotif() {
    this.resetSelectedAddress();
    this.delNotif = new NotificationObject();
  }

  makeDefault(id) {
    this.resetAddressForm();
    let addressObj: any = {};
    for (let i = 0; i < this.addressInfo.length; i++) {
      if (this.addressInfo[i].id === id) {
        addressObj = this.addressInfo[i];
        break;
      }
    }
    addressObj.default = true;
    this.editAddress(addressObj, true);
    this.addAdress(true);
  }
  closeDelModal() {
    this.resetSelectedAddress();
  }
  resetSelectedAddress() {
    this.selectedAddressChange.emit(true);
    this.selectedAddress = null;
  }
}
