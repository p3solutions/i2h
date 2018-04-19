import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
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
  addressInfo: any = [];
  // tagSet = tagSet;
  // tagList = [];
  // stateList = stateList;
  // addProgress = false;
  selectedAddress: any = null;
  deleteProgress = false;
  delNotif = new NotificationObject();
  delCssClass = 'del-address';
  editCssClass = 'edit-address';
  selectedAddressObj: any;

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

  onAddressChanged(isAddressChanged) {
    // console.log('onAddressChanged', isAddressChanged);
    if (isAddressChanged) {
      this.getAddress();
    }
  }
  onSelectedAddressChanged(isSelectedAddressChanged) {
    // console.log('isSelectedAddressChanged', isSelectedAddressChanged);
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
  // showAdressTemplate() {
  //   this.showTemplate = true;
  //   this.resetSelectedAddress();
  // }
  // enableAddButton(e) {
  //   if (this.name !== '' && this.contact !== '' && this.address !== '' &&
  //     this.state !== '' && this.pincode !== '' && this.city !== '' && this.locality !== ''
  //   ) {
  //     this.enableAddBtn = true;
  //     if (e.keyCode === 13) {
  //       this.addAdress(false);
  //     }
  //   } else {
  //     this.enableAddBtn = false;
  //   }
  // }

  // showMap() {
  //   console.log('Google Maps/API still not integrated');
  // }
  // setPotentialTags() {
  //   const tags = new Set(this.tagSet);
  //   this.addressInfo.forEach(address => {
  //     if (address.tag !== 'Other') {
  //       tags.delete(address.tag);
  //     }
  //   });
  //   this.tagList = [];
  //   tags.forEach((tag) => { this.tagList.push(tag); });
  // }

  // resetTagList() {
  //   this.tagList = [];
  //   this.tagSet.forEach((tag) => { this.tagList.push(tag); });
  // }
  // addAdress(isMakeDefault) {
  //   this.addProgress = true;
  //   if (!this.tag) {
  //     this.tag = (this.addressInfo.length === 0) ? 'Home' : 'Other';
  //   }
  //   const addressObj: any = {
  //     tag: this.tag,
  //     name: this.name,
  //     contact: this.contact,
  //     address: this.address,
  //     city: this.city,
  //     pincode: this.pincode,
  //     locality: this.locality,
  //     state: this.state,
  //     landmark: this.landmark,
  //     altContact: this.altContact,
  //     default: (this.addressInfo.length === 0) || (this.selectedAddress && this.selectedAddress.default)
  //   };
  //   if (this.selectedAddress) {
  //     addressObj.id = this.selectedAddress.id;
  //     this.userInfoService.updateAddress(addressObj).subscribe((res) => {
  //       if (res && res.status === 'success') {
  //         for (let i = 0; i < this.addressInfo.length; i++) {
  //           if (this.addressInfo[i].id === addressObj.id) {
  //             this.commonUtilityService.copyObject(addressObj, this.addressInfo[i]);
  //             if (isMakeDefault) {
  //               this.addressInfo[i].default = true;
  //             }
  //           } else if (isMakeDefault) {
  //             this.addressInfo[i].default = false;
  //           }
  //         }
  //         this.resetSelectedAddress();
  //         this.resetAddressForm();
  //       }
  //     });
  //   } else {
  //     this.userInfoService.addAddress(addressObj).subscribe( (res) => {
  //       if (res && res.status === 'success') {
  //         addressObj.id = res.lastObjId;
  //         this.addressInfo.push(addressObj);
  //         this.resetAddressForm();
  //       }
  //     });
  //   }
  // }

  // resetAddressForm() {
  //   // this.showTemplate = false;
  //   // this.addProgress = false;
  //   this.enableAddBtn = false;
  //   this.tag = '';
  //   this.contact = '';
  //   this.name = '';
  //   this.address = '';
  //   this.city = '';
  //   this.state = '';
  //   this.locality = '';
  //   this.landmark = '';
  //   this.pincode = '';
  //   this.altContact = '';
  //   // this.setPotentialTags();
  // }

  // editAddress(addressObj, isMakeDefault) {
  //   if (!isMakeDefault) {
  //     this.resetTagList();
  //     this.showTemplate = true;
  //   }
  //   this.selectedAddress = addressObj;
  //   this.selectedAddress.css = this.editCssClass;
  //   this.tag = this.selectedAddress.tag;
  //   this.contact = this.selectedAddress.contact;
  //   this.name = this.selectedAddress.name;
  //   this.address = this.selectedAddress.address;
  //   this.city = this.selectedAddress.city;
  //   this.state = this.selectedAddress.state;
  //   this.locality = this.selectedAddress.locality;
  //   this.landmark = this.selectedAddress.landmark;
  //   this.pincode = this.selectedAddress.pincode;
  //   this.altContact = this.selectedAddress.altContact;
  // }
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
              const cancelBtn: HTMLButtonElement = document.querySelector('#confirmDeleteModal .cancel');
              cancelBtn.click();
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
}
