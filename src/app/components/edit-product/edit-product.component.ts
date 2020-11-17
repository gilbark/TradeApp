import { Product } from "src/app/models/product.model";
import { ProductsService } from "./../../services/products.service";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { Condition } from "src/app/models/condition.model";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { Observable, Observer } from "rxjs";

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
  imagesDataUrls: string[] | File[] = [];
  // Chip properties
  visible = true;
  selectable = true;
  removable = true;
  seperatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = [];
  base64Image: any;

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
            id: productData.product._id,
            title: productData.product.title,
            description: productData.product.description,
            tags: productData.product.tags,
            condition: productData.product.condition,
            images: productData.product.images,
            owner: productData.product.owner,
            rating: productData.product.owner.rating.value,
          };

          this.selectedCondition = this.conditions[
            this.conditions.findIndex(
              (condition) => condition.viewValue === this.product.condition
            )
          ].value;

          this.form.setValue({
            title: this.product.title,
            description: this.product.description,
            tagsCtrl: this.product.tags,
            images: this.product.images,
            condition: this.selectedCondition,
          });

          this.imageUrls = this.product.images;

          this.product.images.forEach((image) => {
            this.imageUrls.push(image.path);
          });

          // TEST GET IMAGE AS FILE
          let imagesUrl = this.product.images as string[];
          imagesUrl.forEach((imageUrl) => {
            if (imageUrl !== undefined) {
              this.getBase64ImageFromURL(imageUrl).subscribe((base64data) => {
                // this is the image as dataUrl
                this.base64Image = "data:image/jpg;base64," + base64data;

                this.loadImages(base64data, imageUrl);
              });
            }
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
    console.log(this.imagesForm);

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
      this.productService.updateProducts(
        productToSend,
        this.imagesForm,
        this.id
      );
    } else {
      this.productService.updateProducts(productToSend, this.imagesForm);
    }
  }

  dataURItoBlob(dataURI, extension) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: "image/" + extension });
    return blob;
  }

  loadImages(imagesDataUrl: any, url: string) {
    const reader = new FileReader();
    const imageBlob = this.dataURItoBlob(
      imagesDataUrl,
      url.split(".")[url.split(".").length - 1]
    );

    const imageFile = new File([imageBlob], url, {
      type: "image/" + url.split(".")[2],
    });
    this.imagesForm.push(imageFile);
    this.form.patchValue({ images: this.imagesForm });
    this.form.get("images").updateValueAndValidity();

    reader.onload = () => {
      this.imageUrls.push(<string>reader.result);
    };

    reader.readAsDataURL(imageBlob);
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
    this.imagesForm.splice(index, 1);
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

  getBase64Image(img: HTMLImageElement) {
    // We create a HTML canvas object that will create a 2d image
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    // This will draw image
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    const dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  getBase64ImageFromURL(url: string) {
    return new Observable((observer: Observer<string>) => {
      // create an image object

      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      if (!img.complete) {
        // This will call another method that will create image from url
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }
}
