import { ImageCarouselComponent } from "./components/image-carousel/image-carousel.component";
import { ProductPreviewComponent } from "./components/product-preview/product-preview.component";
import { HomeComponent } from "./components/home/home.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "product-preview", component: ProductPreviewComponent },
  { path: "image-carousel", component: ImageCarouselComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
