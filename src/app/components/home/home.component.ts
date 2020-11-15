import { ProductsService } from "./../../services/products.service";
import { Component, OnInit } from "@angular/core";
import { Product } from "src/app/models/product.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  inMyProducts = false;
  constructor(
    private productService: ProductsService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.router.url === "/my-products") {
      this.products = this.productService
        .getProducts()
        .filter((product) => product.user === "Gilb1");
      this.inMyProducts = true;
    } else {
      this.products = this.productService.getProducts();
      this.inMyProducts = false;
    }
  }
}
