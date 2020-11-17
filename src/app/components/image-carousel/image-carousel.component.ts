import { ProductsService } from "./../../services/products.service";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

@Component({
  selector: "app-image-carousel",
  templateUrl: "./image-carousel.component.html",
  styleUrls: ["./image-carousel.component.scss"],
})
export class ImageCarouselComponent implements OnInit, OnDestroy {
  @Input() images: string[];
  imageObjects: { path: string }[];
  constructor(private productService: ProductsService) {}

  ngOnInit() {
    console.log(this.images);

    this.imageObjects = this.images.map((image) => {
      return { path: image };
    });
  }

  ngOnDestroy() {}
}
