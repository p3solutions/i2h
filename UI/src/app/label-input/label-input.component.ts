import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-label-input',
  templateUrl: './label-input.component.html',
  styleUrls: ['./label-input.component.css']
})
export class LabelInputComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  //   $('.input-effect').load(function () {
  //     $('.input-effect input').focusout(function () {
  //       if ($(this).val() !== '') {
  //         $(this).addClass('has-content');
  //       } else {
  //         $(this).removeClass('has-content');
  //       }
  //     });
  //   });
  }

}
