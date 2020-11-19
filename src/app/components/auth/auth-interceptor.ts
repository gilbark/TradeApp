import { AuthService } from "src/app/services/auth.service";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

// Used to intercept all outgoing http calls and append Authorization header with token to request

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get auth token
    const authToken = this.authService.getToken();

    // Clone request and set Authorization header
    const authRequest = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${authToken}`),
    });

    // Forward the new request with headers
    return next.handle(authRequest);
  }
}
