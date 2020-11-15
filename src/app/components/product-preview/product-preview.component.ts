import { ProductsService } from "./../../services/products.service";
import { OfferComponent } from "./../offer/offer.component";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Product } from "src/app/models/product.model";
import { Subscription } from "rxjs";

@Component({
  selector: "app-product-preview",
  templateUrl: "./product-preview.component.html",
  styleUrls: ["./product-preview.component.scss"],
})
export class ProductPreviewComponent implements OnInit, OnDestroy {
  @Input() product: Product;
  userLoggedIn = true;
  viewingMyProducts = true;
  inOfferMode = false;

  constructor(
    private router: Router,
    private registerDialog: MatDialog,
    private productService: ProductsService
  ) {}

  ngOnInit() {
    if (this.router.url === "/my-products") {
      this.viewingMyProducts = true;
    } else {
      this.viewingMyProducts = false;
    }
  }

  ngOnDestroy() {}

  openOfferModal() {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.id = "register-modal-component";
    // dialogConfig.disableClose = true;
    // dialogConfig.width = "80%";
    // dialogConfig.height = "wrap-content";
    // this.inOfferMode = true;
    // const registerModal = this.registerDialog.open(
    //   OfferComponent,
    //   dialogConfig
    // );
  }
}
