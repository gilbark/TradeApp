import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { IvyCarouselModule } from "angular-responsive-carousel";
import { EllipsisPipe } from "../ellipsis.pipe";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";

const matModules: any[] = [
  MatCardModule,
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  MatExpansionModule,
  MatDialogModule,
];

@NgModule({
  declarations: [EllipsisPipe],
  imports: [CommonModule, ...matModules],
  exports: [EllipsisPipe, IvyCarouselModule, ...matModules],
})
export class MaterialModule {}
