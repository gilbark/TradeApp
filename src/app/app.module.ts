import { AuthInterceptor } from "./components/auth/auth-interceptor";
import { AuthGuard } from "./guards/auth.guard";
import { DeleteDialogComponent } from "./components/delete-dialog/delete-dialog.component";
import { EditProductComponent } from "./components/edit-product/edit-product.component";
import { PipeModule } from "./shared/pipe.module";
import { ProductPageComponent } from "./components/product-page/product-page.component";
import { OfferComponent } from "./components/offer/offer.component";
import { ImageCarouselComponent } from "./components/image-carousel/image-carousel.component";
import { ProductPreviewComponent } from "./components/product-preview/product-preview.component";
import { HomeComponent } from "./components/home/home.component";
import { HeaderComponent } from "./components/header/header.component";
import { AppRoutingModule } from "./app-routing.module";
import { SharedModule } from "./shared/shared.module";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { LoginComponent } from "./components/auth/login/login.component";
import { RegisterComponent } from "./components/auth/register/register.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    OfferComponent,
    EditProductComponent,
    ProductPageComponent,
    ProductPreviewComponent,
    ImageCarouselComponent,
    RegisterComponent,
    LoginComponent,
    DeleteDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    PipeModule.forRoot(),
  ],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
