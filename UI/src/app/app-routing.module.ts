import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { componentFactoryName } from '@angular/compiler';
import { Component } from '@angular/core/src/metadata/directives';
import { SigninComponent } from './signin/signin.component';
import { AccountComponent } from './account/account.component';
import { OrderComponent } from './order/order.component';
import { AuthGuardService } from './auth-guard.service';
import { SettingsComponent } from './settings/settings.component';
import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { AddressComponent } from './address/address.component';
import { DependentsComponent } from './dependents/dependents.component';
import { CompareComponent } from './compare/compare.component';
import { OrderHistoryComponent } from './order-history/order-history.component';

const routes: Routes = [
    {
        path: 'sign-in',
        component: SigninComponent
    }, {
        path: 'landing',
        canActivate: [AuthGuardService],
        component: LandingComponent,
        children: [
            {
                path: '', redirectTo: 'history', pathMatch: 'full'
            }, {
                path: 'register/:email',
                canActivate: [AuthGuardService],
                component: AccountComponent
            }, {
                path: 'settings',
                canActivate: [AuthGuardService],
                component: SettingsComponent,
                children: [
                    {
                        path: '', redirectTo: 'profile', pathMatch: 'full'
                    },
                    {
                        path: 'profile',
                        canActivate: [AuthGuardService],
                        component: ProfileComponent
                    }, {
                        path: 'address',
                        canActivate: [AuthGuardService],
                        component: AddressComponent
                    }, {
                        path: 'dependents',
                        canActivate: [AuthGuardService],
                        component: DependentsComponent
                    }, {
                        path: 'compare',
                        canActivate: [AuthGuardService],
                        component: CompareComponent
                    }
                ]
            }, {
                path: 'order',
                canActivate: [AuthGuardService],
                component: OrderComponent
            }, {
                path: 'history',
                canActivate: [AuthGuardService],
                component: OrderHistoryComponent
            }
        ]
    }, {
        path: '', redirectTo: '/sign-in', pathMatch: 'full'
    }
];
@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: false })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
