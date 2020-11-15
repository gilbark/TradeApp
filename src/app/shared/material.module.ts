import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { IvyCarouselModule } from "angular-responsive-carousel";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatBadgeModule } from "@angular/material/badge";

const matModules: any[] = [
  MatCardModule,
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  MatExpansionModule,
  MatDialogModule,
  MatSelectModule,
  MatInputModule,
  MatBadgeModule,
];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...matModules],
  exports: [IvyCarouselModule, ...matModules],
})
export class MaterialModule {}
