import { Attribute, Directive } from "@angular/core";
import { NG_VALIDATORS } from "@angular/forms";

@Directive({
  selector: "[appPasswordValidator]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordValidatorDirective,
      multi: true,
    },
  ],
})
export class PasswordValidatorDirective {
  constructor(
    @Attribute("compare-password") public comparer: string,
    @Attribute("parent") public parent: string
  ) {}

  validate(c: any): { [key: string]: any } {
    const e = c.root.get(this.comparer);

    if (e && c.value !== e.value && !this.isParent) {
      return { compare: true };
    }

    if(e && c.value === e.value &&)
  }
}
