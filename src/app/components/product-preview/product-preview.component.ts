import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Product } from "src/app/models/product.model";

@Component({
  selector: "app-product-preview",
  templateUrl: "./product-preview.component.html",
  styleUrls: ["./product-preview.component.scss"],
})
export class ProductPreviewComponent implements OnInit {
  @Input() product: Product;
  userLoggedIn = true;
  viewingMyProducts = true;

  constructor(private router: Router) {}

  ngOnInit() {
    if (this.router.url === "/my-products") {
      this.viewingMyProducts = true;
    } else {
      this.viewingMyProducts = false;
    }
  }
}
