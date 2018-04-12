import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonUtilityService } from '../common-utility.service';
import { UserDetails, AddressDetails } from '../i2h-objects';
import { UserInfoService } from '../userinfo.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit, OnDestroy {
  componentIcon = 'fa-address-card';
  userInfo: UserDetails;
  addressName: string;
  addressContact: string;
  addressLine: string;
  enabledAddBtn = false;
  showTemplate = false;
  addressInfo: any = [];

  constructor(
    private commonUtilityService: CommonUtilityService,
    private userInfoService: UserInfoService
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

  handleLabelName(e) {
    this.commonUtilityService.handleInputLabelName(e);
  }
  allowOnlyNumbers(e) {
    this.commonUtilityService.allowOnlyNumbers(e);
  }
  pasteOnlyNumbers(e) {
    this.commonUtilityService.pasteOnlyNumbers(e);
  }

  showAdressTemplate() {
    this.showTemplate = true;
    this.addressContact = this.addressName = this.addressLine = '';
  }
  enableAddButton(e) {
    console.log(this.addressName, this.addressContact, this.addressLine);
    if (this.addressName !== '' && this.addressContact !== '' && this.addressLine !== '') {
      this.enabledAddBtn = true;
      if (e.keyCode === 13) {
        this.createAdress();
      }
    } else {
      this.enabledAddBtn = false;
    }
  }

  showMap() {
    //
  }
  createAdress() {
    this.showTemplate = false;
    const addressObj = {
      addressId: '',
      name: this.addressName,
      contact: this.addressContact,
      address: this.addressLine
    };
    this.addressInfo.push(addressObj);
    this.enabledAddBtn = false;
  }
  editAddress() {
    //
  }
  deleteAddress() {
    //
  }
}
