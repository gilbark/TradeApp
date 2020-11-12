import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-image-carousel",
  templateUrl: "./image-carousel.component.html",
  styleUrls: ["./image-carousel.component.scss"],
})
export class ImageCarouselComponent implements OnInit {
  images = [{ path: "assets/guitar1.png" }, { path: "assets/guitar2.jpg" }];
  constructor() {}

  ngOnInit() {}
}
