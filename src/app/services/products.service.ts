import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Product } from "../models/product.model";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  private productsChangedSubject = new Subject<Product[]>();
  private products: Product[] = [];

  constructor(private http: HttpClient) {}

  getProducts() {
    this.http
      .get<{ products: any }>("http://localhost:3000/products/")
      .pipe(
        map((productData) => {
          return {
            products: productData.products.map((product) => {
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
    }>("http://localhost:3000/products/" + id);
  }

  // updateProduct(id: number, product: Product) {
  //   this.products[id - 1] = product;
  //   this.productsChangedSubject.next([...this.products]);
  // }

  addProduct(product: Product, images: File[]) {
    const productData = new FormData();
    productData.append("title", product.title);
    productData.append("description", product.description);
    if (product.tags.length > 0) {
      product.tags.forEach((tag) => {
        productData.append("tags", tag);
      });
    }
    productData.append("condition", product.condition);
    productData.append("ownerId", "5fb2813e0453e727887444ea");
    const files: Array<File> = images;
    for (let i = 0; i < files.length; i++) {
      productData.append("images[]", images[i], images[i]["name"]);
    }

    productData.append("inTrade", "false");
    this.http
      .post("http://localhost:3000/products", productData)
      .subscribe((responseData) => {
        console.log(responseData);
      });

    this.productsChangedSubject.next([...this.products]);
  }
}
