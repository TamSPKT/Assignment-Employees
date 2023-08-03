import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const root = `${environment.apiUrl}/auth`;

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private tokenSubject: BehaviorSubject<string | null>;
  public token: Observable<string | null>;

  constructor(private http: HttpClient, private router: Router) {
    this.tokenSubject = new BehaviorSubject(localStorage.getItem('Bearer'));
    this.token = this.tokenSubject.asObservable();
  }

  public get getBearerToken() {
    return this.tokenSubject.value;
  }

  public get getTokenSubject() {
    if (this.getBearerToken) {
      const sub = JSON.parse(atob(this.getBearerToken.split('.')[1])).sub;
      if (typeof sub === 'string') {
        return sub;
      }
    }
    return null;
  }

  public get isTokenExpired() {
    if (this.getBearerToken) {
      const exp = JSON.parse(atob(this.getBearerToken.split('.')[1])).exp;
      if (typeof exp === 'number') {
        return exp * 1000 <= Date.now();
      }
    }
    return false;
  }

  login(username: string, password: string) {
    const credentials = btoa(username + ':' + password);
    const headers = new HttpHeaders({ Authorization: `Basic ${credentials}` });
    return this.http
      .post(
        `${root}/token`,
        {},
        { headers: headers, responseType: 'text' } // https://github.com/angular/angular/issues/18672#issuecomment-455435341
      )
      .pipe(
        map((token) => {
          // store in local storage to keep user logged in between page refreshes
          localStorage.setItem('Bearer', token);
          this.tokenSubject.next(token);
          return token;
        })
      );
  }

  logout() {
    // remove from local storage to log user out
    localStorage.removeItem('Bearer');
    this.tokenSubject.next(null);
    this.router.navigate(['/login']);
  }

  getAuthentication() {
    return this.http.get(`${environment.apiUrl}/authentication`);
  }
}
