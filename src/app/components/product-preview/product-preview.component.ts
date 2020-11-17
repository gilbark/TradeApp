import { DeleteDialogComponent } from "./../delete-dialog/delete-dialog.component";
import { ProductsService } from "./../../services/products.service";
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { Router } from "@angular/router";
import { Product } from "src/app/models/product.model";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AuthService } from "src/app/services/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-product-preview",
  templateUrl: "./product-preview.component.html",
  styleUrls: ["./product-preview.component.scss"],
})
export class ProductPreviewComponent implements OnInit, OnDestroy {
  @Input() product: Product;
  @Output() modalOpen: EventEmitter<boolean> = new EventEmitter<boolean>();
  userLoggedIn = true;
  viewingMyProducts = true;
  userId: string;
  private authStatusSubscription: Subscription;

  constructor(
    private productService: ProductsService,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userLoggedIn = isAuthenticated;
        this.userId = this.authService.getUserID();
      });

    if (this.router.url === "/my-products") {
      this.viewingMyProducts = true;
    } else {
      this.viewingMyProducts = false;
    }
  }
  deleteProduct() {
    this.modalOpen.emit(true);
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: this.product,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.modalOpen.emit(false);
      if (result === "") {
        this.productService.deleteProduct(this.product.id);
      }
      console.log(result);
    });
  }
  ngOnDestroy() {}
}
