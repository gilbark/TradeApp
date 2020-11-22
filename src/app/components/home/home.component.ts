import { TradeService } from "./../../services/trade.service";
import { ProductsService } from "./../../services/products.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Product } from "src/app/models/product.model";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  inMyProducts = false;
  modalOpen = false;
  userIsAuthenticated = false;
  userId: string;
  offers: string[];
  loading: boolean;
  totalProductCount: number;
  // Pageing props
  totalProducts = 0;
  productsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [];

  // Private props
  private productsSubscription: Subscription;
  private authStatusSubscription: Subscription;

  constructor(
    private productService: ProductsService,
    private router: Router,
    private authService: AuthService,
    private tradeService: TradeService
  ) {}

  ngOnInit() {
    // Handle Auth
    this.userId = this.authService.getUserID();
    this.authStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        // Validate user auth status
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserID();
      });

    this.productsSubscription = this.productService
      .getProductsSubject()
      .subscribe((products) => {
        this.totalProductCount = this.productService.getMaxProducts();

        this.products = products;
        this.totalProducts = this.totalProductCount;

        // Populate page size options by total products in db
        switch (true) {
          case this.totalProducts < 4:
            this.pageSizeOptions = [this.totalProductCount];
            break;
          case this.totalProducts < 10:
            this.pageSizeOptions = [5];
            break;
          case this.totalProducts < 15:
            this.pageSizeOptions = [5, 10];
            break;
          default:
            this.pageSizeOptions = [5, 10, 15];
            break;
        }
      });

    // Get all products from DB or my products if on my-products
    if (this.router.url === "/my-products") {
      this.inMyProducts = true;
    } else {
      this.inMyProducts = false;
    }

    this.productService.getProducts(
      this.inMyProducts ? this.userId : "",
      this.productsPerPage,
      this.currentPage
    );
  }

  onChangedPage(pageData: PageEvent) {
    this.loading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.productService.getProducts(
      this.inMyProducts ? this.userId : "",
      this.productsPerPage,
      this.currentPage
    );
  }

  ngOnDestroy() {
    this.productsSubscription.unsubscribe();
    this.authStatusSubscription.unsubscribe();
  }

  changeModalStatus(modalStatus: any) {
    this.modalOpen = modalStatus;
  }
}
