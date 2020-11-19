import { Subscription } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { NgForm } from "@angular/forms";
import { Component, OnDestroy, OnInit } from "@angular/core";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginFailed = false;
  private authStatusSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((response) => {
        this.loginFailed = !response;
      });
  }
  loginUser(form: NgForm) {
    this.loginFailed = false;
    if (!form.valid) {
      return;
    }
    this.authService.login(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
