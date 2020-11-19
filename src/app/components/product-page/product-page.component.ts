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
  product: Product;
  someotherparam: any;
  loading = true;
  private productId: string;

  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loading = true;
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
      });
    });
  }
}
