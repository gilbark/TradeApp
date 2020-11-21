import { AuthService } from "./../../services/auth.service";
import { ProductsService } from "./../../services/products.service";
import { Product } from "src/app/models/product.model";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Offer } from "src/app/models/offer.model";
import { Subscription } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-product-page",
  templateUrl: "./product-page.component.html",
  styleUrls: ["./product-page.component.scss"],
})
export class ProductPageComponent implements OnInit {
  product: Product;
  loading = true;
  myProduct = false;
  alreadyOffered = false;
  userId: string;
  products: Product[] = [];
  private productId: string;
  private productsSubscription: Subscription;

  constructor(
    private productService: ProductsService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loading = true;
    // Handle Auth
    this.userId = this.authService.getUserID();

    this.route.params.subscribe((params: Params) => {
      this.productId = params["id"];
      this.productService.getProduct(this.productId).subscribe((response) => {
        const transformedProduct = {
          id: response.transformedProduct._id,
          title: response.transformedProduct.title,
          description: response.transformedProduct.description,
          condition: response.transformedProduct.condition,
          images: response.transformedProduct.images,
          owner: response.transformedProduct.owner,
        };

        this.product = transformedProduct;
        this.loading = false;
        if (this.product.owner._id === this.userId) {
          this.myProduct = true;
        } else {
          this.productService.getProducts(this.userId);
        }
      });
    });

    this.productService.getProductsSubject().subscribe((products) => {
      this.products = products;
      const offeredToThis = this.products.map((ps) => ps.offers)[1];
      if (
        offeredToThis.filter(
          (offered) => offered.forProduct === this.product.id
        ).length > 0
      ) {
        this.alreadyOffered = true;
      }
    });
  }

  switchOffered(event) {
    this.alreadyOffered = event;
    this._snackBar.open("Offer submitted!", "Dismiss", { duration: 2500 });
  }
}
