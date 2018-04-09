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
  private landingUrl = '/landing/history';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) { }

  private saveToken(token: string): void {
    localStorage.setItem('i2h-token', token);
    this.token = token;
  }

  private getToken(): string {
    this.token = localStorage.getItem('i2h-token');
    return this.token;
  }

  getRegisterUrl(email) {
    return this.registerUrl + email;
  }
  getLoginUrl(): string {
    return this.loginUrl;
  }
  getLandingUrl(): string {
    return this.landingUrl;
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

  private request(
    method: 'post' | 'get',
    type: 'login' | 'register' | 'profile' | 'updateUser',
    useAuth,
    user?: TokenPayload): Observable<any> {
    let base;

    if (method === 'post') {
      if (useAuth) {
        base = this.http.post(`${this.apiUrl}/${type}`, user, { headers: { Authorization: `Bearer ${this.getToken()}` } });
      } else {
        base = this.http.post(`${this.apiUrl}/${type}`, user, { headers: this.headers });
      }
    } else {
      if (useAuth) {
        base = this.http.get(`${this.apiUrl}/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` } });
      } else {
        base = this.http.get(`${this.apiUrl}/${type}`, { headers: this.headers });
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

  public register(user: TokenPayload): Observable<any> {
    return this.request('post', 'register', false, user);
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request('post', 'login', false, user);
  }

  public profile(): Observable<any> {
    return this.request('get', 'profile', true);
  }

  public updateUser(user: TokenPayload): Observable<any> {
    return this.request('post', 'updateUser', true, user);
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('i2h-token');
    this.router.navigateByUrl('/');
  }
}
