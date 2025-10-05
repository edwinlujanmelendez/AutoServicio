import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // TODO: API - ECOMMERCE TOKEN
  url_api_ecommerce_token: string = "https://www.movilbus.pe/backendEcommerce/Auth/Login";                              /* URL PRODUCTIVO - ECOMMERCE */
  //url_api_ecommerce_token: string = "https://www.movilbus.pe/devbackEcoBus/Auth/Login";                               /* URL DESARROLLO - ECOMMERCE */

  private tokenKey = 'jwtToken';
  private tokenExpKey = 'jwtTokenExp';

  constructor(private http: HttpClient) {}

  getTokenFromAPI() {
    const datos = {
      username: "lead",
      password: "123Movil2025$"
    };

    return this.http.post<any>(this.url_api_ecommerce_token, datos).pipe(
      tap(response => {
        const token = response['jwt'];
        const expiresInMinutes = 19;
        const expiration = new Date().getTime() + expiresInMinutes * 60 * 1000;
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.tokenExpKey, expiration.toString());
      })
    );
  }

  getValidToken(): Observable<string> {
    const token = localStorage.getItem(this.tokenKey);
    const exp = localStorage.getItem(this.tokenExpKey);

    if (token && exp && new Date().getTime() < Number(exp)) {
      // Token válido aún
      return of(token);
    } else {
      // Token vencido, se pide uno nuevo
      return this.getTokenFromAPI().pipe(map(() => localStorage.getItem(this.tokenKey)!));
    }
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenExpKey);
  }
}