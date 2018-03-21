import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { environment } from '../../environments/environment';

@Injectable()
export class SigninService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private signinPasswordUrl = environment.apiUrl + 'login/password';
  private signinOTPUrl = environment.apiUrl + 'login/otp';
  private getOTPUrl = environment.apiUrl + 'login/mailOTP';
  private saveUserInfoUrl = environment.apiUrl + 'login/saveUserInfo';
  constructor(private http: HttpClient) { }

  signIn(params: any) {
    let res;
    if (params.password) {
      res = this.signInViaPassword(params);
    } else {
      res = this.signInViaOTP(params);
    }
    return res;
  }
  signInViaPassword(params: any): Observable<any> {
    console.log(params, 'pswd');
    return this.http.post<any>(this.signinPasswordUrl, params, { headers: this.headers });
  }
  signInViaOTP(params: any): Observable<any> {
    console.log(params, 'otp');
    return this.http.post<any>(this.signinOTPUrl, params, { headers: this.headers });
  }
  mailOTP(emailParam) {
    console.log(emailParam, 'mailOTP');
    return this.http.post<any>(this.getOTPUrl, emailParam, { headers: this.headers });
  }

  saveUserInfo(params) {
    console.log(params, 'saveUserInfo');
    return this.http.post<any>(this.saveUserInfoUrl, params, { headers: this.headers });
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
  /** Log a message with the MessageService */
  private log(message: string) {
    console.log(message);
  }
}
