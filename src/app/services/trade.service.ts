import { ProductsService } from "./products.service";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl + "/trades/";

@Injectable({
  providedIn: "root",
})
export class TradeService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private productService: ProductsService
  ) {}

  createTrade(offeredToId: string, offeredProdId: string) {
    const tradeBody = {
      forId: offeredToId,
      offeredId: offeredProdId,
    };
    this.http.post(BACKEND_URL + "new", tradeBody).subscribe((response) => {});
  }

  acceptOffer(tradeId: string) {
    this.http
      .patch(BACKEND_URL + "accept/" + tradeId, {})
      .subscribe((response) => {
        this.productService.getProducts(this.authService.getUserID());
      });
  }

  getMyOffers() {
    return this.http.get<{ offers: [{ offers: string[] }] }>(
      BACKEND_URL + this.authService.getUserID()
    );
  }
}
