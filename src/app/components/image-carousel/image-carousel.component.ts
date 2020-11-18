import { ProductsService } from "./../../services/products.service";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

@Component({
  selector: "app-image-carousel",
  templateUrl: "./image-carousel.component.html",
  styleUrls: ["./image-carousel.component.scss"],
})
export class ImageCarouselComponent implements OnInit {
  @Input() images: string[];
  imageObjects: { path: string }[];

  ngOnInit() {
    // Map images to an object that Carousel component understands
    this.imageObjects = this.images.map((image) => {
      return { path: image };
    });
  }
}
