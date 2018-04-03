import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthenticationService, private router: Router) { }

  canActivate() {
    console.log('canActivate -> ');
    if (!this.auth.isLoggedIn()) {
      console.log('false isLoggedIn');
      this.router.navigate([this.auth.getLoginUrl()]);
      return false;
    }
    return true;
  }
}
