import { ProductsService } from "./../../services/products.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Product } from "src/app/models/product.model";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  inMyProducts = false;
  modalOpen = false;
  private productsSubscription: Subscription;

  constructor(
    private productService: ProductsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productService.getProducts();

    this.productsSubscription = this.productService
      .getProductsSubject()
      .subscribe((products) => {
        this.products = products;
      });

    this.checkAndFilter(this.products);
  }

  ngOnDestroy() {
    this.productsSubscription.unsubscribe();
  }

  checkAndFilter(products: Product[]) {
    if (this.router.url === "/my-products") {
      this.products = products.filter((product) => product.owner === "Gilb1");
      this.inMyProducts = true;
    } else {
      this.products = products;
      this.inMyProducts = false;
    }
  }
  changeModalStatus(modalStatus: any) {
    this.modalOpen = modalStatus;
  }
}
