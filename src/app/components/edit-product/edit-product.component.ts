import { Product } from "src/app/models/product.model";
import { ProductsService } from "./../../services/products.service";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { Condition } from "src/app/models/condition.model";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";

const fileTypes = ["png", "bmp", "jpg", "jpeg"];

@Component({
  selector: "app-edit-product",
  templateUrl: "./edit-product.component.html",
  styleUrls: ["./edit-product.component.scss"],
})
export class EditProductComponent implements OnInit {
  // General properties
  product: Product;
  editMode: boolean;
  form: FormGroup;
  descriptionTextCount = 0;
  titleTextCount = 0;
  imageUrls = [];
  selectedCondition: string;
  imagesForm: File[] = [];
  // Chip properties
  visible = true;
  selectable = true;
  removable = true;
  seperatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = [];
  @ViewChild("tagsInput") tagsInput: ElementRef<HTMLInputElement>;

  // Private properties
  private id: string;

  conditions: Condition[] = [
    { value: "used", viewValue: "Used" },
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
    let title = "";
    let imagePaths = [];
    let description = "";
    this.selectedCondition = this.conditions[0].value;

    this.form = new FormGroup({
      title: new FormControl(title, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      description: new FormControl(description, {
        validators: [Validators.required, Validators.minLength(20)],
      }),
      images: new FormControl([], {
        validators: [Validators.required],
      }),
      condition: new FormControl(this.selectedCondition, {
        validators: [Validators.required],
      }),
      tagsCtrl: new FormControl(null),
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params["id"];
      this.editMode = this.id ? true : false;
      if (this.editMode) {
        this.productService.getProduct(this.id).subscribe((productData) => {
          this.product = {
            id: productData._id,
            title: productData.title,
            description: productData.description,
            tags: productData.tags,
            condition: productData.condition,
            images: productData.images,
            owner: productData.owner,
          };
          this.form.setValue({
            title: this.product.title,
            description: this.product.description,
            tagsCtrl: this.product.tags,
            images: [...this.product.images],
            condition: this.conditions[this.product.condition],
          });
          this.product.images.forEach((image) => {
            this.imageUrls.push(image.path);
          });
        });
      } else {
        this.editMode = false;
        this.id = null;
        this.form.setValue({
          title,
          description,
          images: imagePaths,
          condition: this.conditions[0],
          tagsCtrl: this.tags,
        });
      }

      this.descriptionTextCount = this.form.value["description"].length;
      this.titleTextCount = this.form.value["title"].length;
    });
  }

  onSubmit() {
    const productToSend: Product = {
      title: this.form.value["title"],
      description: this.form.value["description"],
      images: this.form.value.images,
      condition: this.conditions.filter(
        (con) => con.value === this.selectedCondition
      )[0].viewValue,
      tags: this.tags,
      id: this.id,
      rating: 4,
      owner: "Gilb1",
    };
    if (this.editMode) {
      // this.productService.updateProduct(this.id, productToSend);
    } else {
      this.productService.addProduct(productToSend, this.imagesForm);
    }
  }

  onImagePicked(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files && files[0]) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();

        const extension = files[i].name
          .split(".")
          [files[i].name.split(".").length - 1].toLowerCase();

        if (fileTypes.some((type) => type === extension)) {
          this.imagesForm.push(files[i]);
          this.form.patchValue({ images: this.imagesForm });
          this.form.get("images").updateValueAndValidity();

          reader.onload = () => {
            this.imageUrls.push(<string>reader.result);
          };

          reader.readAsDataURL(files[i]);
        }
      }
    }
  }

  removeImage(index: number) {
    this.imageUrls.splice(index, 1);
  }

  textInputChanged(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    if ((event.target as HTMLInputElement).id === "description") {
      this.descriptionTextCount = value.length;
    } else {
      this.titleTextCount = value.length;
    }
  }

  addChip(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || "").trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }

    this.form.setControl("tagsCtrl", new FormControl(null));
  }

  removeChip(tag: string) {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
}
