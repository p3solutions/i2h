import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { environment } from '../environments/environment';

@Injectable()
export class MailerService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private getOTPUrl = environment.apiUrl + '/mailotp';
  private saveUserInfoUrl = environment.apiUrl + '/saveUserInfo';
  constructor(private http: HttpClient) { }

  mailOTP(emailParam) {
    console.log(emailParam, 'mailOTP');
    return this.http.post<any>(this.getOTPUrl, emailParam, { headers: this.headers });
  }

  saveUserInfo(params) {
    console.log(params, 'saveUserInfo');
    const tempParam = {
      firstname: params.fname,
      lastsname: params.lname
    };
    return this.http.post<any>(this.saveUserInfoUrl, tempParam, { headers: this.headers });
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
