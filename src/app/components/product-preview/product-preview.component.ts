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
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "src/app/services/auth.service";
import { Subscription } from "rxjs";
import { StarRatingComponent } from "ng-starrating";

@Component({
  selector: "app-product-preview",
  templateUrl: "./product-preview.component.html",
  styleUrls: ["./product-preview.component.scss"],
})
export class ProductPreviewComponent implements OnInit, OnDestroy {
  @Input() product: Product;
  // Used to check if user is in Delete Modal in order to change DOM elements
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
    this.userId = this.authService.getUserID();
    this.userLoggedIn = this.authService.getIsAuth();
    this.authStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        // Check user auth status
        this.userLoggedIn = isAuthenticated;
        this.userId = this.authService.getUserID();
      });

    // If in my-products, filter by user's own products (currently filtered on frontend)
    if (this.router.url === "/my-products") {
      this.viewingMyProducts = true;
    } else {
      this.viewingMyProducts = false;
    }
  }

  // If delete button clicked, open the Delete modal
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
    });
  }

  // When rating component clicked
  onRate($event: {
    oldValue: number;
    newValue: number;
    starRating: StarRatingComponent;
  }) {
    this.authService.updateUserRating(this.product.owner._id, $event.newValue);
  }

  ngOnDestroy() {
    this.authStatusSubscription.unsubscribe();
  }
}
