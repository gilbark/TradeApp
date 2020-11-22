import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription;
  signupForm: FormGroup;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        // console.log(authStatus);
      });
    this.signupForm = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      username: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      password: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(20),
          Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$"),
        ],
      }),
      country: new FormControl(null, {
        validators: [Validators.required],
      }),
      city: new FormControl(null, {
        validators: [Validators.required],
      }),
      address: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
  }

  onSignup() {
    if (this.signupForm.invalid) {
      return;
    }
    this.authService.createUser(this.signupForm);
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
