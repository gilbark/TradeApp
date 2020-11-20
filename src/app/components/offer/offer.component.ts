import { Router } from "@angular/router";
import { TradeService } from "./../../services/trade.service";
import { AuthService } from "src/app/services/auth.service";
import { ProductsService } from "./../../services/products.service";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Product } from "src/app/models/product.model";
import { Subscription } from "rxjs";

@Component({
  selector: "app-offer",
  templateUrl: "./offer.component.html",
  styleUrls: ["./offer.component.scss"],
})
export class OfferComponent implements OnInit, OnDestroy {
  products: Product[] = [];

  // Used to know if user needs to see the offers on his products
  viewingMyProducts = false;

  // Gets the product the user has opened this component from
  @Input() currProduct: Product;

  // Private properties
  private userId: string;
  private authStatusSubscription: Subscription;
  private productStatusSubscription: Subscription;

  constructor(
    private productService: ProductsService,
    private authService: AuthService,
    private tradeService: TradeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.userId = this.authService.getUserID();
      });

    if (this.router.url === "/my-products") {
      this.viewingMyProducts = true;

      this.currProduct.offers.forEach((offer) => {
        this.productService
          .getProduct(offer.offeredProduct)
          .subscribe((response) => {
            const transformedProduct = {
              id: response.transformedProduct._id,
              title: response.transformedProduct.title,
              description: response.transformedProduct.description,
              condition: response.transformedProduct.condition,
              images: response.transformedProduct.images,
              owner: response.transformedProduct.owner,
            };

            this.products.push(transformedProduct);
          });
      });
      console.log(this.currProduct);
    } else {
      this.products = this.productService.getMyProducts();
    }

    this.productStatusSubscription = this.productService
      .getProductsSubject()
      .subscribe((products) => {
        this.products = products;
      });
  }
  submitOffer(id: string) {
    this.tradeService.createTrade(this.currProduct.id, id);
  }
  ngOnDestroy() {
    this.authStatusSubscription.unsubscribe();
  }
}
