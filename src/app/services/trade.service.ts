import { AuthService } from "src/app/services/auth.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl + "/trades/";

@Injectable({
  providedIn: "root",
})
export class TradeService {
  constructor(private http: HttpClient, private authService: AuthService) {}
  createTrade(offeredToId: string, offeredProdId: string) {
    const tradeBody = {
      forId: offeredToId,
      offeredId: offeredProdId,
    };
    this.http.post(BACKEND_URL + "new", tradeBody).subscribe((response) => {
      console.log(response);
    });
  }
  getMyOffers() {
    this.http
      .get<{ offers: string[] }>(BACKEND_URL + this.authService.getUserID())
      .subscribe((response) => {});
  }
}
