import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Product } from "../models/product.model";
import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl + "/products/";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  private productsChangedSubject = new Subject<Product[]>();
  private products: Product[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  getProducts() {
    this.http
      .get<{ transformedProducts: any }>(BACKEND_URL)
      .pipe(
        map((productData) => {
          console.log(productData);

          return {
            products: productData.transformedProducts.map((product) => {
              console.log(product);

              return {
                title: product.title,
                description: product.description,
                id: product._id,
                images: product.images,
                condition: product.condition,
                owner: product.owner.username,
                tags: product.tags,
                rating: product.owner.rating.value,
              };
            }),
          };
        })
      )
      .subscribe((transformedProductData) => {
        this.products = transformedProductData.products;
        this.productsChangedSubject.next([...this.products]);
      });
  }

  getProductsSubject() {
    return this.productsChangedSubject.asObservable();
  }

  getProduct(id: string) {
    return this.http.get<{
      product: {
        _id: string;
        title: string;
        description: string;
        tags: string[];
        condition: string;
        images: string[];
        owner: any;
        rating: any;
      };
    }>(BACKEND_URL + id);
  }

  updateProducts(product: Product, images: File[], id?: string) {
    const productData = new FormData();
    productData.append("title", product.title);
    productData.append("description", product.description);
    if (product.tags.length > 0) {
      product.tags.forEach((tag) => {
        productData.append("tags", tag);
      });
    }
    productData.append("condition", product.condition);
    productData.append("ownerId", product.owner.id);
    const files: Array<File> = images;
    for (let i = 0; i < files.length; i++) {
      productData.append("images[]", images[i], images[i]["name"]);
    }
    productData.append("inTrade", "false");
    console.log(product.owner);

    if (id) {
      this.http.put(BACKEND_URL + id, productData).subscribe((responseData) => {
        console.log(responseData);
      });
    } else {
      this.http.post(BACKEND_URL, productData).subscribe((responseData) => {
        console.log(responseData);
      });
    }
    this.getProducts();
    this.productsChangedSubject.next([...this.products]);
    this.router.navigate(["/my-products"]);
  }

  deleteProduct(id: string) {
    this.http.delete(BACKEND_URL + id).subscribe((res) => {
      console.log(res);
      this.products.splice(
        this.products.findIndex((product) => product.id === id),
        1
      );
      this.productsChangedSubject.next([...this.products]);
    });
  }
}
