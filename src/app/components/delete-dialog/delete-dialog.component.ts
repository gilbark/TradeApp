import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Product } from "src/app/models/product.model";

@Component({
  selector: "app-delete-dialog",
  templateUrl: "./delete-dialog.component.html",
  styleUrls: ["./delete-dialog.component.scss"],
})
export class DeleteDialogComponent implements OnInit {
  product: Product;
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Product
  ) {}

  ngOnInit() {
    if (this.data) {
      this.product = this.data;
    }
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}
