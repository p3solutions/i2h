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
import { UserInfoService } from './userinfo.service';
import { HttpClientModule } from '@angular/common/http';
import { AccountComponent } from './account/account.component';
import { OrderComponent } from './order/order.component';
import { AuthGuardService } from './auth-guard.service';
import { AuthenticationService } from './authentication.service';
import { RouterModule, Routes } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    LabelInputComponent,
    NavbarComponent,
    AccountComponent,
    OrderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    CommonUtilityService,
    AuthGuardService,
    UserInfoService,
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
