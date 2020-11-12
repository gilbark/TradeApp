import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
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
