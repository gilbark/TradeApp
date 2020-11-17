import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl + "/users/";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}
  createUser(form: any) {
    console.log(form.form.value);
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
    this.http.post(BACKEND_URL, userToCreate).subscribe(
      (response) => {
        this.router.navigate(["/"]);
      },
      (error) => {
        console.log("user creation failed");
      }
    );
  }
}
