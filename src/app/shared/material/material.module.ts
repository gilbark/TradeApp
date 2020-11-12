import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatToolbarModule,
} from "@angular/material";
import { IvyCarouselModule } from "angular-responsive-carousel";

const matModules: any[] = [
  MatCardModule,
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  IvyCarouselModule,
];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...matModules],
  exports: [...matModules],
})
export class MaterialModule {}
