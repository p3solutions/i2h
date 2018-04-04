import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

export interface UserDetails {
  _id: string;
  email: string;
  fname: string;
  password: string;
  lname: string;
  mobile: string;
  dob: string;
  sex: string;
  exp: number;
  iat: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  _id: string;
  email: string;
  password?: string;
  otp?: string;
  fname?: string;
  lname?: string;
  mobile?: string;
  dob?: string;
  sex?: string;
}

@Injectable()
export class AuthenticationService {
  private token: string;
  private apiUrl = environment.apiUrl;
  private loginUrl = '/sign-in';
  private registerUrl = '/landing/register/';
  private orderUrl = '/landing/order';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) { }

  private saveToken(token: string): void {
    localStorage.setItem('i2h-token', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('i2h-token');
    }
    return this.token;
  }

  getRegisterUrl(email) {
    return this.registerUrl + email;
  }
  getLoginUrl(): string {
    return this.loginUrl;
  }
  getOrderUrl(): string {
    return this.orderUrl;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }
  public getLoggedInUser(): UserDetails {
    const user = this.getUserDetails();
    if (user && (user.exp > Date.now() / 1000)) {
      return user;
    } else {
      return null;
    }
  }
  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      // console.log(user.exp, Date.now() / 1000, user.exp > Date.now() / 1000);
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  private request(method: 'post' | 'get', type: 'login' | 'register' | 'profile', user?: TokenPayload): Observable<any> {
    let base;

    if (method === 'post') {
      base = this.http.post(`${this.apiUrl}/${type}`, user, { headers: this.headers });
    } else {
      if (type === 'profile') {
        base = this.http.get(`${this.apiUrl}/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` } });
      }
      // base = this.http.get(`${this.apiUrl}/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` } });
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

  public register(user: TokenPayload): Observable<any> {
    return this.request('post', 'register', user);
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request('post', 'login', user);
  }

  public profile(): Observable<any> {
    return this.request('get', 'profile');
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('i2h-token');
    this.router.navigateByUrl('/');
  }
}
