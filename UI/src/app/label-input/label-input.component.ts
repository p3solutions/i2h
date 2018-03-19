import { Component, OnInit, Input, Output } from '@angular/core';
import { CommonUtilityService } from '../common-utility.service';
@Component({
  selector: 'app-label-input',
  templateUrl: './label-input.component.html',
  styleUrls: ['./label-input.component.css']
})
export class LabelInputComponent implements OnInit {
  @Input() labelName: string;
  @Input() faIcon: string;
  @Input() divClassName: string;
  @Input() widthDimension: string;
  @Input() validationRequired: string;
  @Input() formCtrlName: string;
  // to set input types
  @Input() inputType: string;
  // inputTypeText = false;
  // inputTypeNumber = false;
  // inputTypeEmail = false;
  // inputTypePassword = false;

  constructor(private commonUtilityService: CommonUtilityService) { }

  ngOnInit() {
    // this.setInputType();
  }

  // setInputType() {
  //   switch (this.inputType) {
  //     case 'number':
  //       this.inputTypeNumber = true;
  //       break;
  //     case 'email':
  //       this.inputTypeEmail = true;
  //       break;
  //     case 'password':
  //       this.inputTypePassword = true;
  //       break;
  //     default:
  //       this.inputTypeText = true;
  //       break;
  //   }
  // }

  handleLabelName(event) {
    const inputValue = event.target.value;
    const classList = event.target.classList;
    if (inputValue !== '') {
      classList.add('has-content');
    } else {
      classList.remove('has-content');
    }
  }

  allowOnlyNumbers(e, inputType) {
    if (inputType === 'number') {
      this.commonUtilityService.allowOnlyNumbers(e);
    }
  }
  pasteOnlyNumbers(e, inputType) {
    if (inputType === 'number') {
      this.commonUtilityService.pasteOnlyNumbers(e);
    }
  }
}
