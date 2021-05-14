import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Category, CompanyCategory, Product, User } from 'src/models';
import { Images } from 'src/models/images.model';
import { ProductVariation } from 'src/models/product.variation.model';
import { ProductVariationOption } from 'src/models/product.variation.option.model';
import { BreadModel } from 'src/models/UxModel.model';
import { AccountService, CompanyCategoryService, ProductService, UploadService } from 'src/services';
import { ImagesService } from 'src/services/images.service';
import { ProductVariationService } from 'src/services/product-variation.service';
import { UxService } from 'src/services/ux.service';
import { PRODUCT_ORDER_LIMIT_MAX, PRODUCT_TYPE_STOCK, STATUS_ACTIIVE_STRING, STATUS_TRASHED_STRING } from 'src/shared/constants';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  showLoader;
  @Input() existingProduct: Product;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() addingProductFinished: EventEmitter<Product> = new EventEmitter();
  setUpVariations: boolean;
  product: Product = {
    ProductId: '',
    ShowRemainingItems: 6,
    CompanyId: '',
    Name: '',
    TotalStock: 0,
    RegularPrice: 0,
    PriceFrom: 0,
    PriceTo: 0,
    Description: '',
    ProductSlug: '',
    CatergoryId: 0,
    ParentCategoryId: 0,
    CategoryName: '',
    ParentCategoryName: '',
    ParentCategoryGuid: '',
    CategoryGuid: '',
    TertiaryCategoryGuid: '',
    TertiaryCategoryName: '',
    ReturnPolicy: '',
    FeaturedImageUrl: '',
    IsJustInTime: PRODUCT_TYPE_STOCK,
    ShowOnline: true,
    EstimatedDeliveryDays: 0,
    OrderLimit: 0,
    SupplierId: '',
    ProductType: '',
    ProductStatus: STATUS_ACTIIVE_STRING,
    Code: '',
    CreateDate: '',
    CreateUserId: '',
    ModifyDate: '',
    ModifyUserId: '',
    StatusId: 1,
  };
  shoWaddNewCatergory: boolean
  editorStyle = {
    height: '180px',
    marginBottom: '30px',
    color: 'black',
  };
  user: User;
  PRODUCT_ORDER_LIMIT_MAX = PRODUCT_ORDER_LIMIT_MAX;
  parentCategories: Category[] = [];
  chilndrenCategories: Category[] = [];
  tertiaryCategories: Category[] = [];
  categories: Category[] = [];


  modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      // ['image']
    ]
  };
  newCatergory: Category;
  sizes: ProductVariation;
  colors: ProductVariation;
  items: BreadModel[];
  STATUS_TRASHED_STRING = STATUS_TRASHED_STRING;
  productLink: any;
  constructor(
    private router: Router,
    private productService: ProductService,
    private accountService: AccountService,
    private companyCategoryService: CompanyCategoryService,
    private uploadService: UploadService,
    private imagesService: ImagesService,
    private uxService: UxService,
    private productVariationService: ProductVariationService,



  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.productService.productObservable.subscribe(data => {
      if (data) {
        this.product = data;
        this.productLink = `${environment.BASE_URL}/shop/product/${this.product.ProductSlug || this.product.ProductId}`;
        if (!this.product.ShowRemainingItems) {
          this.product.ShowRemainingItems = 6;
        }
        this.loadOptions();

        this.items = [
          {
            Name: 'Dashboard',
            Link: '/admin/dashboard'
          },
          {
            Name: 'Products',
            Link: '/admin/dashboard/products'
          },
          {
            Name: this.product.Name,
            Link: null
          }
        ];
      }
    })
    if (this.existingProduct && this.existingProduct.ProductId) {
      this.product = this.existingProduct;
    }
    else {
      this.product.CompanyId = this.user.CompanyId;
      this.product.CreateUserId = this.user.CompanyId;
      this.product.ModifyUserId = this.user.CompanyId;
      this.productService.getProducts(this.user.CompanyId);

      this.productService.productListObservable.subscribe(data => {
        if (data) {
          this.product.Code = `P00${data.length + 1}`;
        }
      });
    }


    this.companyCategoryService.getSystemCategories(this.user.CompanyId, 'All');
    this.companyCategoryService.systemCategoryListObservable.subscribe(data => {
      if (data && data.length) {
        this.categories = data;
        this.parentCategories = this.categories && this.categories.filter(x => x.CategoryType === 'Parent' && Number(x.StatusId) === 1);
        if (this.parentCategories && this.parentCategories.length) {
          if (!this.product.ParentCategoryGuid) {
            const categoryId = this.parentCategories[0].CategoryId;
            this.product.ParentCategoryGuid = categoryId;
            this.selectCategory(categoryId);
          }
        }
        this.parentCategories.map(x => x.IsSelected = false);
        this.parentCategories.sort(function (a, b) {
          var textA = b.Name.toString();
          var textB = a.Name.toString();;
          return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
        });
        if (this.product && this.product.ProductId) {
          this.selectCategory(this.product.ParentCategoryGuid);
          if (this.product && this.product.ProductId && this.product.Images && this.product.Images.length) {
            let isMain = this.product.Images.find(x => x.IsMain == 1);
            if (!isMain) {
              isMain = this.product.Images[0];
              this.product.FeaturedImageUrl = isMain && isMain.Url;
              this.productService.update(this.product).subscribe(data => {
                if (data) {
                  this.product.Images[0].IsMain = 1;
                  this.imagesService.update(this.product.Images[0]).subscribe(ie => {
                    if (ie && ie.ImageId) {
                      console.log(ie);

                    }
                  })
                }
              });
            }
            this.product.FeaturedImageUrl = isMain && isMain.Url;
          }
        }
      }
    });
    this.loadOptions();

  }
  name() { }
  loadOptions() {

    if (this.product) {
      this.sizes = this.product.ProductVariations && this.product.ProductVariations.find(x => x.VariationName === 'Size');
      this.colors = this.product.ProductVariations && this.product.ProductVariations.find(x => x.VariationName === 'Color');
      if (this.product.Images && this.product.Images.length) {
        this.product.Images[0].Class = ['active']
      }
    }
  }
  saveProduct() {
    this.product.ProductSlug = this.productService.generateSlug(this.user.Company.Name, this.product.Name, this.product.Code);
    if (this.product.ParentCategoryGuid) {
      this.product.ParentCategoryName = this.categories && this.categories.find(x => x.CategoryId === this.product.ParentCategoryGuid).Name;
    }
    if (this.product.CategoryGuid) {
      this.product.CategoryName = this.categories && this.categories.find(x => x.CategoryId === this.product.CategoryGuid).Name;
    }
    if (this.product.TertiaryCategoryGuid) {
      this.product.TertiaryCategoryName = this.categories && this.categories.find(x => x.CategoryId === this.product.TertiaryCategoryGuid).Name;
    }
    this.uxService.updateLoadingState({ Loading: true, Message: 'Saving a product, please wait...' })
    if (this.product.ProductId && this.product.CreateDate) {
      this.productService.update(this.product).subscribe(data => {
        this.uxService.updateLoadingState({ Loading: false, Message: undefined });

        if (data) {
          this.addingProductFinished.emit(data);
        }
      });
    } else {
      this.productService.add(this.product).subscribe(data => {
        if (data && data.ProductId) {
          this.product.ProductId = data.ProductId;
          this.product.CreateDate = data.CreateDate;
          this.addingProductFinished.emit(data);
          this.showLoader = false;
        }
      });
    }

  }
  back() {
    this.router.navigate([`/admin/dashboard/products`]);
  }
  selectCategory(categoryId: string) {
    if (categoryId && categoryId.length) {
      if (categoryId.split(':').length === 2) {
        categoryId = categoryId.split(':')[1].trim();
      }
      this.chilndrenCategories = this.categories.filter(x => x.ParentId === categoryId && x.CategoryType === 'Child' && Number(x.StatusId) === 1);
      this.tertiaryCategories = this.categories.filter(x => x.ParentId === categoryId && x.CategoryType === 'Tertiary' && Number(x.StatusId) === 1);

      this.chilndrenCategories.sort(function (a, b) {
        var textA = b.Name.toString();
        var textB = a.Name.toString();;
        return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
      });
      this.tertiaryCategories.sort(function (a, b) {
        var textA = b.Name.toString();
        var textB = a.Name.toString();;
        return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
      });


      if (!this.product.CategoryGuid && this.chilndrenCategories.length) {
        this.product.CategoryGuid = this.chilndrenCategories[0].CategoryId;
      }

      if (!this.product.TertiaryCategoryGuid && this.tertiaryCategories.length) {
        this.product.TertiaryCategoryGuid = this.tertiaryCategories[0].CategoryId;;
      }
    }
  }

  public uploadFile = (files: FileList) => {
    if (files.length === 0) {
      return;
    }

    Array.from(files).forEach(file => {
      this.uploadService.resizeImage(file, this.product);
    });




  }
  onProductVariationChanged(productVariations: ProductVariation[]) {
    if (productVariations && productVariations.length) {
      this.product.ProductVariations = productVariations;

    }

  }
  onCloseOptionModal(e) {
    this.setUpVariations = false;
  }
  saveImage(image: Images) {
    if (image) {

      this.showLoader = true;
      this.imagesService.add(image).subscribe(data => {
        if (data && data.ImageId) {
          if (!this.product.Images) {
            this.product.Images = [];
          }
          this.product.Images.push(data);
          if (!this.product.FeaturedImageUrl) {
            this.product.FeaturedImageUrl = this.product.Images[0].Url;
          }
          this.showLoader = false;
          this.uxService.updateMessagePopState(`New Image uploaded.`);
          this.productService.updateProductState(this.product);
        }

      })
    }
  }

  deleteImage(image: Images) {
    if (image) {
      image.StatusId = 2;
      this.showLoader = true;
      this.imagesService.update(image).subscribe(data => {
        if (data && data.ImageId) {
          this.showLoader = false;
          this.product.Images.splice(image.Index, 1);
          this.uxService.updateMessagePopState(`Image deleted.`);
        }

      })
    }
  }
  setMianImage(image: Images) {
    if (image) {
      const main = this.product.Images.find(x => x.ImageId === image.ImageId);
      if (main) {
        this.product.Images.map(x => x.IsMain = 0);
        main.IsMain = 1;
        this.showLoader = true;
        this.imagesService.updateRange(this.product.Images).subscribe(data => {
          if (data && data.ProductId && data.Images) {
            this.showLoader = false;
            this.product.Images = data.Images;
            this.product.FeaturedImageUrl = main.Url;
            this.product.Images.sort(function (a, b) {
              var textA = a.IsMain.toString();
              var textB = b.IsMain.toString();;
              return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
            });
            this.productService.updateProductState(this.product);
            this.productService.update(this.product).subscribe(data => {
              console.log(data);
            })
          }

        })
      }
    }
  }
  showImage(image: Images) {
    this.product.FeaturedImageUrl = image.Url;
  }


  saveCatergory() {
    if (this.newCatergory.CategoryId && this.newCatergory.CategoryId.length > 5) {
      this.companyCategoryService.update(this.newCatergory).subscribe(data => {

      })
    }
    else {
      this.companyCategoryService.add(this.newCatergory).subscribe(data => {
        if (data && data.CategoryId) {
          if (!this.chilndrenCategories || !this.chilndrenCategories.length) {
            this.chilndrenCategories = [];
          }
          if (!this.categories || !this.categories.length) {
            this.categories = [];
          }
          if (data.CategoryType === 'Tertiary') {
            this.tertiaryCategories.push(data);
            this.product.TertiaryCategoryGuid = data.CategoryId;
          }
          if (data.CategoryType === 'Child') {
            this.chilndrenCategories.push(data);
            this.product.CategoryGuid = data.CategoryId;
          }
          this.categories.push(data);
          this.uxService.updateMessagePopState(`New category created.`);
          this.newCatergory = undefined;
          this.shoWaddNewCatergory = false;
        }
      });
    }
  }

  toggleShowOnline(e: boolean) {

  }

  catChanged() {
    if (this.product.CategoryGuid === 'add') {
      this.addNewSubCat('Child');
    }
    if (this.product.TertiaryCategoryGuid === 'add-tertiary') {
      this.addNewSubCat('Tertiary');
    }
  }


  addNewSubCat(type) {
    this.shoWaddNewCatergory = true;
    if (this.parentCategories && this.parentCategories.length) {
      const parent = this.parentCategories.find(x => x.CategoryId === this.product.ParentCategoryGuid);
      this.newCatergory = {
        CategoryId: '',
        Name: '',
        ParentId: parent.CategoryId,
        Description: '',
        DisplayOrder: 0,
        CategoryType: type,
        CompanyType: 'Fashion',
        ImageUrl: '',
        PhoneBanner: '',
        IsDeleted: false,
        CreateUserId: this.user.UserId,
        ModifyUserId: this.user.UserId,
        StatusId: 1,
        Children: []
      };

    }

  }
  toggleSetUpVariations() {
    if (this.product.ParentCategoryGuid) {
      this.product.ParentCategoryName = this.categories && this.categories.find(x => x.CategoryId === this.product.ParentCategoryGuid).Name;
    }
    if (this.product.CategoryGuid) {
      this.product.CategoryName = this.categories && this.categories.find(x => x.CategoryId === this.product.CategoryGuid).Name;
    }
    this.productService.update(this.product).subscribe(res => {
      if (res && res.ProductId) {
        this.productService.updateProductState(res);
        this.router.navigate(['admin/dashboard/product-variations', this.product.ProductId]);
      }
    })
  }
  toggleShowOptionOnline(option: ProductVariationOption, showOnline: string) {
    option.ShowOnline = showOnline;
    this.productVariationService.updateProductVariationOption(option).subscribe(data => {
      console.log(data);

    })
  }

  delete() {
    if (confirm("Product will be moved trash, press ok to continue.")) {
      this.product.ProductStatus = STATUS_TRASHED_STRING;
      this.productService.update(this.product).subscribe(res => {
        if (res && res.ProductId) {
          this.productService.updateProductState(res);
          this.back();
        }
      })
    }

  }
  undelete() {
    if (confirm("Product will be moved out of trash to active, press ok to activate product.")) {
      this.product.ProductStatus = STATUS_ACTIIVE_STRING;
      this.productService.update(this.product).subscribe(res => {
        if (res && res.ProductId) {
          this.productService.updateProductState(res);
          // this.back();
          this.uxService.updateMessagePopState('Product is now active')
        }
      })
    }

  }

  copy() {

    let nav: any;
    nav = window.navigator;
    if (nav.share) {
      nav.share({
        title: 'Hello there!',
        text: `Check out this ${this.product.Name}`,
        url: this.productLink
        ,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      this.uxService.updateMessagePopState('Shop LinkCopied to clipboard.');
    }
  }
}
