import { Product } from "src/app/models/product.model";
import { ProductsService } from "./../../services/products.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { mimeType } from "./mime-type.validator";
import { Condition } from "src/app/models/condition.model";

@Component({
  selector: "app-edit-product",
  templateUrl: "./edit-product.component.html",
  styleUrls: ["./edit-product.component.scss"],
})
export class EditProductComponent implements OnInit {
  product: Product;
  editMode: boolean;
  form: FormGroup;
  textCount = 0;
  imageUrls = [];
  selectedCondition: string;
  private id: number;

  conditions: Condition[] = [
    { value: "usable", viewValue: "Usable" },
    { value: "refurbished", viewValue: "Refurbished" },
    { value: "forParts", viewValue: "Usable for parts" },
    { value: "good", viewValue: "Good" },
    { value: "excellent", viewValue: "Excellent" },
    { value: "likeNew", viewValue: "Like new" },
    { value: "secondHand", viewValue: "Second hand" },
  ];

  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params["id"];
      this.editMode = this.id ? true : false;
      this.initForm();
    });
  }

  initForm() {
    let title = "";
    let imagePaths = [];
    let description = "";
    let condition = "";

    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      description: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(20)],
      }),
      images: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
      condition: new FormControl(null, {
        validators: Validators.required,
      }),
    });

    if (this.editMode) {
      this.product = this.productService.getProduct(this.id);
      title = this.product.title;
      imagePaths = this.product.images;
      description = this.product.description;
      condition = this.product.condition;

      this.form.setValue({
        title: this.product.title,
        description: this.product.description,
        images: this.product.images,
        condition: this.product.condition,
      });
      this.imageUrls = this.product.images.map((i) => i.path);
      this.textCount = document.getElementById("description").nodeValue.length;
    }
  }

  onSubmit() {}

  onImagePicked(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (
      (event.target as HTMLInputElement).files &&
      (event.target as HTMLInputElement).files[0]
    ) {
      for (let i = 0; i < files.length; i++) {
        var reader = new FileReader();

        reader.readAsDataURL(files[i]);
        reader.onload = (event: any) => {
          this.imageUrls.push(event.target.result);
        };
        this.form.patchValue({ images: this.imageUrls });
        this.form.get("images").updateValueAndValidity();
      }
    }
  }

  removeImage(index: number) {
    this.imageUrls.splice(index, 1);
  }

  textInputChanged(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.textCount = value.length;
  }
}
