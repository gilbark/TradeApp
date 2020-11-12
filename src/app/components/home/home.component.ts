import { Component, OnInit } from "@angular/core";
import { Product } from "src/app/models/product.model";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  private products: Product[] = [
    {
      title: "Guitar",
      description: "This is a pretty awesome guitar!",
      condition: "Used",
      images: ["assets/logo.png"],
      user: "Gilb1",
      rating: 4,
    },
    {
      title: "Guitar Amp",
      description: "This is a pretty awesome guitar amp!",
      condition: "Used",
      images: ["assets/logo.png"],
      user: "Gilb1",
      rating: 4,
    },
    {
      title: "Guitar string",
      description: "This are great guitar strings!",
      condition: "Used",
      images: ["assets/logo.png"],
      user: "Gilb1",
      rating: 4,
    },
  ];

  constructor() {}

  ngOnInit() {}
}
