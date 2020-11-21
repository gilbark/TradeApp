import { Offer } from "./../../models/offer.model";
import { Router } from "@angular/router";
import { TradeService } from "./../../services/trade.service";
import { AuthService } from "src/app/services/auth.service";
import { ProductsService } from "./../../services/products.service";
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { Product } from "src/app/models/product.model";
import { Subscription } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-offer",
  templateUrl: "./offer.component.html",
  styleUrls: ["./offer.component.scss"],
})
export class OfferComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  alreadyOffered = false;
  // Used to know if user needs to see the offers on his products
  viewingMyProducts = false;

  // Gets the product the user has opened this component from
  @Input() currProduct: Product;
  @Input() myProducts?: Product[];
  @Output() offerInitiated: EventEmitter<boolean> = new EventEmitter<boolean>();
  // Private properties
  private userId: string;
  private authStatusSubscription: Subscription;
  private productStatusSubscription: Subscription;

  constructor(
    private productService: ProductsService,
    private authService: AuthService,
    private tradeService: TradeService,
    private router: Router,
    private _snackBar: MatSnackBar
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
          .getProduct(offer.forProduct)
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
    } else {
      this.products = this.myProducts;
    }

    this.productStatusSubscription = this.productService
      .getProductsSubject()
      .subscribe((products) => {
        this.products = products;
      });
  }
  submitOffer(id: string) {
    this.tradeService.createTrade(this.currProduct.id, id);
    this.offerInitiated.emit(true);
  }

  acceptOffer(offeredProdId: string) {
    const thisOffer = this.currProduct.offers.filter((offer) => {
      return offer.forProduct === offeredProdId;
    })[0];

    this.tradeService.acceptOffer(thisOffer._id);

    this._snackBar.open("Your trade has been completed!", "Dismiss", {
      duration: 2500,
    });
  }

  ngOnDestroy() {
    this.authStatusSubscription.unsubscribe();
  }
}
