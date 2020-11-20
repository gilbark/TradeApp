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
  products: Product[];
  @Input() currProduct: Product;
  private userId: string;
  private authStatusSubscription: Subscription;
  private productStatusSubscription: Subscription;

  constructor(
    private productService: ProductsService,
    private authService: AuthService,
    private tradeService: TradeService
  ) {}

  ngOnInit() {
    this.authStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.userId = this.authService.getUserID();
      });

    this.products = this.productService.getLocalProducts();

    console.log(this.products);

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
