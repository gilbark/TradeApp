import { AuthGuard } from "./guards/auth.guard";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { EditProductComponent } from "./components/edit-product/edit-product.component";
import { ProductPageComponent } from "./components/product-page/product-page.component";
import { ImageCarouselComponent } from "./components/image-carousel/image-carousel.component";
import { ProductPreviewComponent } from "./components/product-preview/product-preview.component";
import { HomeComponent } from "./components/home/home.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "product-preview", component: ProductPreviewComponent },
  { path: "my-products", component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: "view/:id",
    component: ProductPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "view/:id/edit",
    component: EditProductComponent,
    canActivate: [AuthGuard],
  },
  { path: "new", component: EditProductComponent, canActivate: [AuthGuard] },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
