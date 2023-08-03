import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthenticationService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get the auth token from the service.
    const authToken = this.auth.getBearerToken;

    if (authToken) {
      // Clone the request and replace the original headers with
      // cloned headers, updated with the authorization.
      let headers = req.headers.set('Authorization', `Bearer ${authToken}`);

      // Default 'Content-Type' is 'application/json'
      if (req.body && !req.headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }

      // send cloned request with header to the next handler.
      const authReq = req.clone({ headers });
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
