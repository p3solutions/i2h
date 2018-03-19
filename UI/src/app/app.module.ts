import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin.component';
import { LabelInputComponent } from './label-input/label-input.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CommonUtilityService } from './common-utility.service';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    LabelInputComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [CommonUtilityService],
  bootstrap: [AppComponent]
})
export class AppModule { }
