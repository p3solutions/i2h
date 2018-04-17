import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonUtilityService } from '../common-utility.service';
import { UserDetails, AddressDetails, NotificationObject } from '../i2h-objects';
import { UserInfoService } from '../userinfo.service';
import { stateList, tagArray, tagSet } from '../hardcoded-collection';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit, OnDestroy {
  componentUrl = 'address';
  userInfo: UserDetails;
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
  showTemplate = false;
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

  constructor(
    private commonUtilityService: CommonUtilityService,
    private userInfoService: UserInfoService
  ) { }

  ngOnInit() {
    this.commonUtilityService.sendData(this.componentUrl);
    this.getAddress();
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

  getAddress() {
    this.userInfoService.getAddress().subscribe((res) => {
      console.log(res);
      if (res && res.status === 'success') {
        const addressList = res.address;
        if (addressList) {
          this.addressInfo = addressList;
          this.setPotentialTag();
        }
      }
    });
  }
  showAdressTemplate() {
    this.showTemplate = true;
  }
  enableAddButton(e) {
    if (this.name !== '' && this.contact !== '' && this.address !== '' &&
      this.state !== '' && this.pincode !== '' && this.city !== '' && this.locality !== ''
    ) {
      this.enableAddBtn = true;
      if (e.keyCode === 13) {
        this.addAdress();
      }
    } else {
      this.enableAddBtn = false;
    }
    // console.log(
    //   (this.name !== '' && this.contact !== '' && this.address !== '' &&
    //     this.state !== '' && this.pincode !== '' && this.city !== '' && this.locality !== ''
    //   ),
    //   this.name, this.contact, this.address, this.state, this.pincode, this.city,
    //   this.locality, this.landmark, this.altContact, this.tag
    // );
  }

  showMap() {
    //
  }
  setPotentialTag() {
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
  addAdress() {
    this.addProgress = true;
    console.log(this.tag, 'creating');
    if (!this.tag) {
      this.tag = (this.addressInfo.length === 0) ? 'Home' : 'Other';
    }
    const addressObj: any = {
      // id: this.selectedAddress.id,
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
      default: (this.addressInfo.length === 0) || this.selectedAddress.default// first address is alwaysa default
    };
    if (this.selectedAddress) {
      addressObj.id = this.selectedAddress.id;
      this.userInfoService.updateAddress(addressObj).subscribe((res) => {
        console.log(res);
        if (res && res.status === 'success') {
          for (let i = 0; i < this.addressInfo.length; i++) {
            if (this.addressInfo[i].id === addressObj.id) {
              this.commonUtilityService.copyObject(addressObj, this.addressInfo[i]);
              console.log('after creating', this.addressInfo);
            }
          }
          this.selectedAddress = null;
          console.log('selected Add', this.selectedAddress);
          this.resetAddressForm();
        }
      });
    } else {
      this.userInfoService.addAddress(addressObj).subscribe( (res) => {
        console.log(res);
        if (res && res.status === 'success') {
          addressObj.id = res.lastObjId;
          this.addressInfo.push(addressObj);
          this.resetAddressForm();
        }
      });
    }
  }
  copyObject(srcObj, destObj) {
    for (const [key, value] of Object.entries(srcObj)) {
      destObj[key] = value;
    }
    console.log('copied obj', destObj);
  }
  resetAddressForm() {
    this.showTemplate = false;
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
    this.setPotentialTag();
  }
  editAddress(addressObj) {
    this.resetTagList();
    this.selectedAddress = addressObj;
    this.selectedAddress.css = this.editCssClass;
    console.log(this.selectedAddress);
    this.showTemplate = true;
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
  }
  setSelectedAddress(addressObj) {
    this.resetAddressForm();
    this.selectedAddress = addressObj;
    this.selectedAddress.css = this.delCssClass;
  }
  deleteAddress() {
    this.deleteProgress = true;
    const id = this.selectedAddress.id;
    console.log('id', id);
    this.userInfoService.deleteAddress(id).subscribe((res) => {
      console.log(res);
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
              document.getElementById('cancel').click();
            }, 1500);
            this.selectedAddress = null;
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
  closeDelNotif() {
    this.selectedAddress = null;
    this.delNotif = new NotificationObject();
  }
  setDefaultAddress(id) {
    this.addressInfo.forEach(address => {
      if (address.id === id) {
        address.default = true;
      } else {
        address.default = false;
      }
    });
  }
  makeDefault(id) {
    this.setDefaultAddress(id);
    // save this.addressInfo
    console.log(this.addressInfo);
  }
  closeDelModal() {
    this.selectedAddress = null;
  }
}
