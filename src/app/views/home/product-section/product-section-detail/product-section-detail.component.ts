import { OrderService, ProductService } from 'src/services';
import { Component, EventEmitter, OnChanges, OnInit, Output } from '@angular/core';
import { Category, Order, Orderproduct, Product, User } from 'src/models';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeShopService } from 'src/services/home-shop.service';
import { ProductVariation } from 'src/models/product.variation.model';
import { Location } from '@angular/common';
import { Company } from 'src/models/company.model';
import { DomSanitizer } from '@angular/platform-browser'
import { ProductVariationOption } from 'src/models/product.variation.option.model';
import { Images } from 'src/models/images.model';
import { CompanyService } from 'src/services/company.service';
import { UxService } from 'src/services/ux.service';
import { ORDER_TYPE_SALES } from 'src/shared/constants';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-product-section-detail',
  templateUrl: './product-section-detail.component.html',
  styleUrls: ['./product-section-detail.component.scss']
})
export class ProductSectionDetailComponent implements OnInit, OnChanges {
  @Output() navAction: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() checkoutOrShopMoreEvent: EventEmitter<string> = new EventEmitter<string>();

  product: Product;
  productSlug: string;
  totalPrice = 0;
  quantity = 0;
  showModal: boolean;
  modalHeading: string;
  orderProducts: Product[];
  sizes: ProductVariation;
  colors: ProductVariation;
  Total: number;
  customer: User;
  order: Order;
  company: Company;
  leavingShowWarning: boolean;
  htmlPreview: any;
  selectedOption: ProductVariationOption;
  imageIndex = 0;
  imageClass;
  fullLink: any;
  baseUrl = environment.BASE_URL;
  carttItems = 0;
  navHistory: string;


  constructor(
    private activatedRoute: ActivatedRoute,
    private homeShopService: HomeShopService,
    private orderService: OrderService,
    private location: Location,
    private sanitizer: DomSanitizer,
    private router: Router,
    private companyService: CompanyService,
    private productService: ProductService,
    private uxService: UxService,


  ) {
    this.activatedRoute.params.subscribe(r => {
      this.productSlug = r.id;
    });
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.uxService.updateLoadingState({ Loading: true, Message: 'Loading product, please wait...' });

    this.productService.getProductSync(this.productSlug).subscribe(data => {
      if (data && data.ProductId) {
        this.product = data;
        this.fullLink = `${this.baseUrl}/shop/product/${this.product.ProductSlug || this.product.ProductId}`;
        if (this.product) {
          this.sanitize();
          this.company = this.product.Company;
          if (this.company && this.company.Promotions) {
            this.product.SalePrice = Number(this.product.RegularPrice) - (Number(this.product.RegularPrice) * (Number(this.company.Promotions[0].DiscountValue) / 100));
            if (Number(this.product.SalePrice) < Number(this.product.RegularPrice)) {
              this.product.OnSale = true;
            }

          }
          this.sizes = this.product.ProductVariations && this.product.ProductVariations.find(x => x.VariationName === 'Size');
          this.colors = this.product.ProductVariations && this.product.ProductVariations.find(x => x.VariationName === 'Color');
          if (this.product.Images && this.product.Images.length) {
            this.product.AllImages = this.product.Images;
            this.product.Images = [];
            if (this.product.Images[0]) {
              this.product.Images[0].Class = ['active'];
              this.product.FeaturedImageUrl = this.product.Images[0].Url
            }

          }

          if (this.colors && this.colors.ProductVariationOptions && this.colors.ProductVariationOptions.length) {
            this.colors.ProductVariationOptions = this.colors.ProductVariationOptions.filter(x => x.ShowOnline === 'show')
            this.selectOption(this.colors.ProductVariationOptions[0], 'Coulor');
          }
          if (this.sizes && this.sizes.ProductVariationOptions && this.sizes.ProductVariationOptions.length) {
            this.selectOption(this.sizes.ProductVariationOptions[0], 'Size');
          }
        }

      }


      this.homeShopService.updatePageMovesIntroTrueFalse(false);
      this.order = this.orderService.currentOrderValue;
      if (!this.order) {
        this.order = {
          OrdersId: '',
          OrderNo: 'Shop',
          CompanyId: this.product.CompanyId,
          Company: this.company,
          CustomerId: '',
          AddressId: '',
          Notes: '',
          OrderType: ORDER_TYPE_SALES,
          Total: 0,
          Paid: 0,
          Due: 0,
          InvoiceDate: new Date(),
          DueDate: '',
          CreateUserId: 'shop',
          ModifyUserId: 'shop',
          Status: 'Not paid',
          StatusId: 1,
          Orderproducts: []
        }
        this.orderService.updateOrderState(this.order);
      }
      this.carttItems = this.order.Orderproducts && this.order.Orderproducts.length || 0;
      this.uxService.updateLoadingState({ Loading: false, Message: undefined });
    })




    // this.updateTotalPrice(this.product.Quantity);
    this.uxService.uxNavHistoryObservable.subscribe(data => {
      this.navHistory = data;
    })
  }

  sanitize() {
    this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(this.product.Description);
  }


  ngOnChanges() {
    this.updateTotalPrice(this.quantity);
  }
  updateTotalPrice(quantity) {
    if (!quantity) {
      quantity = 1;
    }
    this.quantity = quantity;
    this.totalPrice = this.product.RegularPrice * quantity;
  }
  addCart(product: Product) {
    if (this.order && this.order.Orderproducts.length) {
      if (this.order.CompanyId !== product.CompanyId) {
        this.leavingShowWarning = true;
        return false;
      }

    }

    if (product && product.ProductId) {
      product.SelectedQuantiy = 1;
      const orderproduct = this.mapOrderproduct(product);
      this.order.Orderproducts.push(orderproduct);
      if (product.Company) {
        this.order.Company = product.Company;
      }
      this.order.CompanyId = product.CompanyId;
      this.calculateTotalOverdue();
      this.order.Total = this.Total;
      this.orderService.updateOrderState(this.order);
      this.showModal = true;
      // this.orderProducts = adding.orderProducts;
      this.modalHeading = `${product.Name} added to bag successfully`;
    }


    // const adding = this.homeShopService.addToCart(product);
    // if (adding.added) {
    //   this.showModal = true;
    //   this.orderProducts = adding.orderProducts;
    //   this.modalHeading = 'Added to cart successfully';
    // }
  }

  closeModal() {
    this.showModal = false;
  }
  continueShopping() {
    this.orderService.updateOrderState(this.order);
    this.router.navigate(['']);
  }
  checkout() {
    this.router.navigate(['shop/checkout']);
  }

  onNavItemClicked(event) { }

  back() {
    // if (this.product) {
    //   this.router.navigate([this.product.CompanyId]);
    //   return;
    // }

    // this.router.navigate(['']);
    // return;
    if (this.navHistory) {
      this.location.back();
    } else {
      this.router.navigate([this.product.CompanyId]);
    }
  }
  bookmark() { }



  mapOrderproduct(product: Product): Orderproduct {
    return {
      Id: '',
      OrderId: '',
      ProductId: product.ProductId,
      CompanyId: product.CompanyId,
      ProductName: product.Name,
      ProductType: 'Product',
      Colour: product.SelectedCoulor || '',
      Size: product.SelectedSize || '',
      Quantity: product.SelectedQuantiy || 1,
      SubTotal: product.SelectedQuantiy * Number(product.RegularPrice),
      UnitPrice: product.SalePrice || product.RegularPrice,
      FeaturedImageUrl: product.FeaturedImageUrl,
      CreateUserId: '',
      ModifyUserId: '',
      StatusId: 1
    };
  }

  calculateTotalOverdue() {
    this.Total = 0;
    this.order.Orderproducts.forEach(line => {
      this.Total += Number(line.UnitPrice);
    });

  }

  toggleLeavingShowWarning() {
    this.leavingShowWarning = !this.leavingShowWarning
  }

  selectOption(option: ProductVariationOption, name) {
    if (this.product && name === 'Coulor') {
      this.colors.ProductVariationOptions.map(x => x.Class = []);
      this.product.SelectedCoulor = option.OptionName;
      this.colors.ProductVariationOptions.map(x => x.IsSelected = false);
      option.IsSelected = true;
      option.Class = ['active-color'];
      this.selectedOption = option;
      if (this.colors && this.colors.ProductVariationOptions && this.colors.ProductVariationOptions.length && this.product.AllImages) {
        this.product.Images = this.product.AllImages.filter(img => img.OptionId === this.selectedOption.Id);
        if (!this.product.Images.length) {
          this.product.Images = this.product.AllImages;
        }
        this.product.FeaturedImageUrl = this.product.Images[0].Url

      }
    }
    if (this.product && name === 'Size') {
      this.sizes.ProductVariationOptions.map(x => x.Class = []);
      this.product.SelectedSize = option.OptionName;
      this.sizes.ProductVariationOptions.map(x => x.IsSelected = false);
      option.IsSelected = true;
      option.Class = ['active'];

    }
    console.log(name, option);

  }
  checkoutOrShopMore(event: string) {
    this.checkoutOrShopMoreEvent.emit(event);
  }
  showImage(image: Images) {
    if (image && this.product.Images) {
      this.product.Images.map(x => x.Class = [])
      image.Class = ['active']
      this.product.FeaturedImageUrl = image.Url;
    }
  }
  handleSwipe(direction) {
    this.imageClass = '';
    if (direction === 'left') {
      if (this.product && this.product.Images) {
        this.imageIndex++;
        this.product.ClassSelector = `class-${this.product.ProductId}`;
        // this.imageClass = 'animation-next-slide';
        if (this.imageIndex > this.product.Images.length - 1) {
          this.imageIndex = 0;
        }
        const featuredImageUrl = this.product.Images[this.imageIndex];
        if (featuredImageUrl) {
          this.showImage(featuredImageUrl);
        }
      }
    }
    if (direction === 'right') {
      if (this.product && this.product.Images) {
        this.imageIndex--;
        // this.imageClass = 'animation-next-slide';
        if (this.imageIndex < 0) {
          this.imageIndex = this.product.Images.length - 1;
        }
        const featuredImageUrl = this.product.Images[this.imageIndex];
        if (featuredImageUrl) {
          this.showImage(featuredImageUrl);
        }
      }
    }

  }

  share() {
    let nav: any;
    nav = window.navigator;
    if (nav.share) {
      const url = this.fullLink;
      nav.share({
        title: 'Hello, checkout.',
        text: `Hi, please check out *${this.product.Name}*`,
        url: url,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      this.uxService.updateMessagePopState('Product Link Copied to clipboard.');

    }
  }

  cart() {
    this.router.navigate(['shop/cart']);
  }

  gotoCompany() {
    this.router.navigate([this.company.Slug || this.company.CompanyId]);
  }
}
