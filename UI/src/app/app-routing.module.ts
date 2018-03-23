import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { componentFactoryName } from '@angular/compiler';
import { Component } from '@angular/core/src/metadata/directives';
import { SigninComponent } from './signin/signin.component';
import { AccountComponent } from './account/account.component';
import { OrderComponent } from './order/order.component';

const routes: Routes = [
    {
        path: 'sign-in', component: SigninComponent
    }, {
        path: 'account/:email', component: AccountComponent
    }, {
        path: 'order', component: OrderComponent
    }, {
        path: '', redirectTo: '/sign-in', pathMatch: 'full'
    }
];
@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: false })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
