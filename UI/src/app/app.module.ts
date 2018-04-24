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
import { LandingComponent } from './landing/landing.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { AddressComponent } from './address/address.component';
import { DependentsComponent } from './dependents/dependents.component';
import { CompareComponent } from './compare/compare.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { AddEditAddressComponent } from './add-edit-address/add-edit-address.component';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AddEditDependentComponent } from './add-edit-dependent/add-edit-dependent.component';


@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    LabelInputComponent,
    NavbarComponent,
    AccountComponent,
    OrderComponent,
    LandingComponent,
    SettingsComponent,
    ProfileComponent,
    AddressComponent,
    DependentsComponent,
    CompareComponent,
    OrderHistoryComponent,
    AddEditAddressComponent,
    AddEditDependentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    Ng2OrderModule
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
