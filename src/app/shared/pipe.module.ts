import { EllipsisPipe } from "./../components/pipes/ellipsis.pipe";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

@NgModule({
  declarations: [EllipsisPipe],
  imports: [CommonModule],
  exports: [EllipsisPipe],
})
export class PipeModule {
  static forRoot() {
    return {
      ngModule: PipeModule,
      providers: [],
    };
  }
}
