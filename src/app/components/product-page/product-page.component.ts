import { ProductsService } from "./../../services/products.service";
import { Product } from "src/app/models/product.model";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: "app-product-page",
  templateUrl: "./product-page.component.html",
  styleUrls: ["./product-page.component.scss"],
})
export class ProductPageComponent implements OnInit {
  private productId: number;
  product: Product;

  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.productId = params["id"];
      this.product = this.productService.getProduct(this.productId);
    });
  }
}
