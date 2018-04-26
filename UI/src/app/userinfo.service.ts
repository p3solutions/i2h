import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { environment } from '../environments/environment';
import { JwtHelper } from 'angular2-jwt';
import { TokenPayload, TokenResponse, UserDetails } from './i2h-objects';

@Injectable()
export class UserInfoService {
  private jwtHelper: JwtHelper = new JwtHelper();
  private token: string;
  private apiUrl = environment.apiUrl;
  private getOTPUrl = this.apiUrl + '/mailOtp';
  private saveUserInfoUrl = this.apiUrl + '/saveUserInfo';
  private getUserInfoUrl = this.apiUrl + '/getUserInfoUrl';

  constructor(private http: HttpClient,

  ) { }

  private saveToken(token: string): void {
    localStorage.setItem('i2h-token', token);
    this.token = token;
  }
  private getToken(): string {
    this.token = localStorage.getItem('i2h-token');
    return this.token;
  }
  private getHeaders() {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }
  private getAuthHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
  }

  private request(
    method: 'post' | 'get',
    url,
    useAuth,
    params?: any): Observable<any> {
    let base;
    if (method === 'post') {
      if (useAuth) {
        base = this.http.post(`${this.apiUrl}/${url}`, params, { headers: this.getAuthHeaders() });
      } else {
        base = this.http.post(`${this.apiUrl}/${url}`, params, { headers: this.getHeaders() });
      }
    } else {
      if (useAuth) {
        base = this.http.get(`${this.apiUrl}/${url}`, { headers: this.getAuthHeaders() });
      } else {
        base = this.http.get(`${this.apiUrl}/${url}`, { headers: this.getHeaders() });
      }
    }
    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );
    return request;
  }


  public updateUser(user: TokenPayload): Observable<any> {
    const url = 'updateUser';
    return this.request('post', url, true, user);
  }

  public mailOTP(email: any): Observable<any> {
    const url = `mailOtp/${email}`;
    return this.request('get', url, false);
  }
  // Address APIs
  public getAddress(): Observable<any> {
    const url = 'getAddress';
    return this.request('get', url, true);
  }
  public getDefaultAddress(): Observable<any> {
    const url = 'getDefaultAddress';
    return this.request('get', url, true);
  }
  public addAddress(params: any): Observable<any> {
    const url = 'addAddress';
    return this.request('post', url, true, {addressObj : params});
  }
  public updateAddress(params: any): Observable<any> {
    const url = 'updateAddress';
    return this.request('post', url, true, { addressObj: params });
  }
  public deleteAddress(id: any): Observable<any> {
    const url = `deleteAddress/${id}`;
    return this.request('get', url, true);
  }
  // dependent APIs
  public getDependent(): Observable<any> {
    const url = 'getDependent';
    return this.request('get', url, true);
  }
  public addDependent(params: any): Observable<any> {
    const url = 'addDependent';
    return this.request('post', url, true, { dependentObj: params });
  }
  public updateDependent(params: any): Observable<any> {
    const url = 'updateDependent';
    return this.request('post', url, true, { dependentObj: params });
  }
  public deleteDependent(id: any): Observable<any> {
    const url = `deleteDependent/${id}`;
    return this.request('get', url, true);
  }

  // user
  getUserInfo(loggedInuser) {
    // const emailId = loggedInuser.emailId;
    return this.http.get<any>(this.getUserInfoUrl, { headers: this.getHeaders() });
  }

  saveUserInfo(params) {
    const tempParam = {
      firstname: params.fname,
      lastsname: params.lname
    };
    return this.http.post<any>(this.saveUserInfoUrl, tempParam, { headers: this.getHeaders() });
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
