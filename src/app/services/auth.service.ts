import { User } from "./../models/user.model";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Subject } from "rxjs";

const BACKEND_URL = environment.apiUrl + "/users/";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private timer: NodeJS.Timer; // Used to auto log off user when token expires
  private token: string;
  private isAuthenticated = false;
  private userId: string;
  private authStatusListener = new Subject<boolean>(); // Will transmit user authentication status to other components

  constructor(private http: HttpClient, private router: Router) {}

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  getToken() {
    return this.token;
  }
  getUserID() {
    return this.userId;
  }

  createUser(form: any) {
    // Get data from form and map to a data body which the API knows
    const userToCreate = {
      email: form.form.value.email,
      username: form.form.value.username,
      password: form.form.value.password,
      address: {
        address: form.form.value.address,
        country: form.form.value.country,
        city: form.form.value.city,
      },
    };

    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + "signup",
        userToCreate
      )
      .subscribe(
        (response) => {
          this.isAuthenticated = true;
          // After user created successfuly transmit true to other components
          this.authStatusListener.next(true);

          // Save token data
          this.saveAuthData(
            response.token,
            new Date(new Date().getTime() + response.expiresIn * 1000),
            response.userId
          );

          // Start token expirety timer
          this.setAuthTimer(response.expiresIn);

          this.router.navigate(["/"]);
        },
        (error) => {}
      );
  }

  login(email: string, password: string) {
    const authData = { email, password };

    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + "login",
        authData
      )
      .subscribe(
        (response) => {
          this.token = response.token;
          if (this.token) {
            const expiresInDuration = response.expiresIn;
            // Initialize token expirety timer
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.userId = response.userId;

            // Save user token to localstorage
            this.saveAuthData(
              this.token,
              new Date(new Date().getTime() + expiresInDuration * 1000),
              this.userId
            );

            this.router.navigate(["/"]);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.authStatusListener.next(false);
    clearTimeout(this.timer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  // Checks if user's token is in their localstorage and is valid, if so, automatically log them in
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  updateUserRating(userId: string, newRating: number) {
    this.http
      .post<{ newRating: number }>(BACKEND_URL + userId, {
        ratingToAdd: newRating,
      })
      .subscribe((response) => {
        console.log("User's new rating is: " + response.newRating);
      });
  }

  // Remove token from localstorage
  private clearAuthData() {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  // Save token to localstorage
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  // Read token data
  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId,
    };
  }

  // Token expirety timer
  private setAuthTimer(duration: number) {
    this.timer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
