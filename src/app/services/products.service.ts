import { AuthService } from "src/app/services/auth.service";
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
  private productCount: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  getMyProducts() {
    return this.products.filter(
      (product) => product.owner._id === this.authService.getUserID()
    );
  }

  getMyOffers(productId: string) {
    // Reach Trade router
    // Trade router will get all Trade objects which have this product ID as "offeredTo"
    // Then the results for those trade IDs, will send back to "offer" component an object:
    // { id: tradeid, thisID, offeredProductID}
    // Then in the offer component will get this object array, and will do foreach on myproducts, then filter on this array for
    // thisID and add to its own offeredProducts array this ID
    // return this.products.filter((product) => product.offers.indexOf(product))
  }

  // Get all products from backend, and transform into a frontend Product object
  getProducts(id?: string, productsPerPage?: number, currentPage?: number) {
    id = id ? id : "";
    const queryParams = `?pagesize=${productsPerPage}&page=${currentPage}`;
    console.log(BACKEND_URL + id + queryParams);

    this.http
      .get<{ transformedProducts: any; count: number }>(
        BACKEND_URL + id + queryParams
      )
      .pipe(
        map((productData) => {
          return {
            products: productData.transformedProducts.map((product) => {
              return {
                title: product.title,
                description: product.description,
                id: product._id,
                images: product.images,
                condition: product.condition,
                owner: product.owner,
                tags: product.tags,
                offers: product.offers.map((offers) => {
                  return {
                    forProduct: offers.offeredProduct,
                    offeredProduct: offers.forProduct,
                    _id: offers._id,
                  };
                }),
              };
            }),
            count: productData.count,
          };
        })
      )
      .subscribe((transformedProductData) => {
        // Set total products in db
        this.productCount = transformedProductData.count;

        // Transmit all products to components
        this.products = transformedProductData.products;
        this.productsChangedSubject.next([...this.products]);
      });
  }

  getMaxProducts() {
    return this.productCount;
  }

  getProductsSubject() {
    return this.productsChangedSubject.asObservable();
  }

  getProduct(id: string) {
    return this.http.get<{
      transformedProduct: {
        _id: string;
        title: string;
        description: string;
        tags: string[];
        condition: string;
        images: string[];
        owner: any;
        rating: any;
      };
    }>(BACKEND_URL + "product/" + id);
  }

  updateProducts(product: Product, images: File[], id?: string) {
    const productData = new FormData();
    productData.append("title", product.title);
    productData.append("description", product.description);

    // Append all tags as array to FormData so it comes as an array
    if (product.tags.length > 0) {
      product.tags.forEach((tag) => {
        productData.append("tags", tag);
      });
    }
    productData.append("condition", product.condition);
    productData.append("ownerId", product.owner._id);

    // Append all images as array to FormData
    const files: Array<File> = images;
    for (let i = 0; i < files.length; i++) {
      productData.append("images[]", images[i], images[i]["name"]);
    }
    productData.append("inTrade", "false"); // Future property to determine if this product is currently being traded

    // If there's an ID, perform update, if not, perform post
    if (id) {
      this.http.put(BACKEND_URL + id, productData).subscribe((responseData) => {
        this.getProducts(product.owner._id, 5, 1);
      });
    } else {
      this.http.post(BACKEND_URL, productData).subscribe((responseData) => {
        this.getProducts(product.owner._id, 5, 1);
      });
    }

    // When done, navigate to my-products
    this.router.navigate(["/my-products"]);
  }

  getNewProducts() {
    this.getProducts();
    this.productsChangedSubject.next([...this.products]);
  }

  deleteProduct(id: string) {
    // Delete product, when done, remove from local array and transmit products to components
    this.http.delete(BACKEND_URL + id).subscribe((res) => {
      this.products.splice(
        this.products.findIndex((product) => product.id === id),
        1
      );
      this.productsChangedSubject.next([...this.products]);
    });
  }
}
