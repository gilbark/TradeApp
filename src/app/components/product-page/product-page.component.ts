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
  private productId: string;
  product: Product;
  someotherparam: any;

  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.product.images = [];
    this.route.params.subscribe((params: Params) => {
      this.productId = params["id"];
      this.productService.getProduct(this.productId).subscribe((product) => {
        const transformedProduct = {
          id: product.product._id,
          title: product.product.title,
          description: product.product.description,
          condition: product.product.condition,
          images: product.product.images,
          owner: product.product.owner.username,
          rating: product.product.owner.rating.value,
        };
        this.product = transformedProduct;
      });
    });
  }
}
