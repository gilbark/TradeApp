import { ProductsService } from "./../../services/products.service";
import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Product } from "src/app/models/product.model";

@Component({
  selector: "app-offer",
  templateUrl: "./offer.component.html",
  styleUrls: ["./offer.component.scss"],
})
export class OfferComponent implements OnInit {
  products: Product[];

  constructor(
    private productService: ProductsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.products = this.productService
      .getProducts()
      .filter((product) => product.user === "Gilb1");
    console.log(this.products);
  }
}
