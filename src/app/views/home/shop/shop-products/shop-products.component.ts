import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Category, Product, User } from 'src/models';
import { Company } from 'src/models/company.model';
import { Interaction, InteractionSearchModel } from 'src/models/interaction.model';
import { Promotion } from 'src/models/promotion.model';
import { NavHistoryUX } from 'src/models/UxModel.model';
import { AccountService, OrderService, UserService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { HomeShopService } from 'src/services/home-shop.service';
import { InteractionService } from 'src/services/Interaction.service';
import { ProductService } from 'src/services/product.service';
import { UxService } from 'src/services/ux.service';
import { ADMIN, DISCOUNT_TYPES, INTERRACTION_TYPE_LIKE, MAX_PAGE_SIZE, ORDER_TYPE_SALES } from 'src/shared/constants';

@Component({
  selector: 'app-shop-products',
  templateUrl: './shop-products.component.html',
  styleUrls: ['./shop-products.component.scss']
})
export class ShopProductsComponent implements OnInit {

  promotions: Promotion[];
  @Output() selectCategoryEvent: EventEmitter<Category> = new EventEmitter<Category>();
  @Output() viewProductEvent: EventEmitter<Product> = new EventEmitter<Product>();
  shopSlug: any;
  company: Company;
  selectedCategory: Category;
  products: Product[];
  allProducts: Product[];
  user: User;
  navHistory: NavHistoryUX;
  interaction: Interaction;
  liked: string = 'no';
  showAdd: boolean;
  parentCategories: Category[] = [];
  catergories: Category[] = [];
  tertiaryCategories: Category[] = [];
  shopOwner: User;
  ADMIN = ADMIN;
  searchString: string
  nextPage = 999999;
  showShowMore: boolean;
  selectedProduct: Product;
  heading = `follow a shop.`
  pendingActionLike: boolean;
  likeAction: string;
  showSetUpCompany: boolean;
  carttItems = 0;

  order: any;
  fullLink: string;
  emptyShop: boolean;
  constructor(
    private homeShopService: HomeShopService,
    private productService: ProductService,
    private uxService: UxService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private interactionService: InteractionService,
    private accountService: AccountService,
    private userService: UserService,
    private orderService: OrderService,

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.shopSlug = r.id;
      this.user = this.accountService.currentUserValue;
      this.getProducts(this.nextPage);



      this.uxService.uxNavHistoryObservable.subscribe(data => {
        this.navHistory = data;
      })

    });
  }

  ngOnInit() {
    this.accountService.user.subscribe(data => {
      this.user = data;
      // this.getInteractions();
      if (this.pendingActionLike) {
        this.onLike(this.likeAction);
      }

    })
    this.loadCart();
  }

  back() {
    this.router.navigate(['']);
  }

  share() {
    let nav: any;
    nav = window.navigator;
    if (nav.share) {
      const url = `${environment.BASE_URL}/${this.company.CompanyId}`;
      nav.share({
        title: 'Hello there, please checkout.',
        text: `Hi, please check out *${this.company.Name}*`,
        url: url,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      this.uxService.showQuickMessage('Product Link Copied to clipboard.');

    }
  }

  getProducts(maxId: number) {
    // this.products = this.productService.getShopProductsState;
    // this.allProducts = this.productService.getShopProductsState;
    this.uxService.showLoader();
    this.productService.shopProductsObservable.subscribe(data => {
      this.uxService.hideLoader();
      if (data && data.length) {
        if (JSON.stringify(data) !== JSON.stringify(this.products)) {
          this.products = data;
          this.allProducts = data;
          this.company = this.products[0].Company;
          this.emptyShop = !this.products[0].ProductId;
          

          this.fullLink = `${environment.BASE_URL}/${this.company.CompanyId}`;
          if (this.company && this.company.Followers) {
            this.company.Followers = this.company.Followers.filter(x => x.SourceName && x.SourceDp)
          }
          if (this.company) {
            this.interactionService.logCompanyPage(this.user, this.company);
          }
          this.nextPage = this.products[this.products.length - 1]?.Id || 99999;
          this.promotions = this.company.Promotions || [];
          this.promotions.map(x => x.Style = { background: x.Bg, color: x.Color });

          // alert(this.company.Name);
          this.getInteractions();
          this.getShopOwner();
        } else {
          this.company = this.products[0].Company;
          this.nextPage = this.products[this.products.length - 1]?.Id || 99999;
          this.promotions = this.company.Promotions || [];
          this.promotions.map(x => x.Style = { background: x.Bg, color: x.Color });
        }
        this.showShowMore = data.length >= MAX_PAGE_SIZE;
        if (this.promotions && this.promotions.length) {
          const promo = this.promotions[0];
          this.products.forEach(product => {
            if (promo.PromoType === DISCOUNT_TYPES[0]) {
              product.SalePrice = (Number(product.RegularPrice) * (Number(promo.DiscountValue) / 100));
              product.SalePrice = (Number(product.RegularPrice) - (Number(product.SalePrice)));
              product.Sale = `${promo.DiscountValue} ${promo.DiscountUnits}`
            }
            if (promo.PromoType === DISCOUNT_TYPES[1]) {
              (product.SalePrice = (Number(product.RegularPrice) - (Number(promo.DiscountValue))));
              product.Sale = `${promo.DiscountValue} ${promo.DiscountUnits}`
            }

            if (Number(product.SalePrice) < Number(product.RegularPrice)) {
              product.OnSale = true;
            }
          }
          )

        }
      } else {
        // assume the user have no company
        if (this.user && this.user.UserId && !this.user.CompanyId) {
          this.showSetUpCompany = true;
        }
      }
    });

    this.productService.getAllActiveProductsForCompany(this.shopSlug, maxId);

  }
  getShopOwner() {
    if (this.company) {
      this.userService.getUsersStync(this.company.CompanyId, ADMIN).subscribe(data => {
        if (data && data.length) {
          this.shopOwner = data[0];
        }
      });
    }

  }

  cart() {
    this.router.navigate(['shop/cart']);
  }
  loadCart() {
    this.order = this.orderService.currentOrderValue;
    if (!this.order) {
      this.order = {
        OrdersId: '',
        OrderNo: 'Shop',
        CompanyId: this.company.CompanyId,
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
  }

  loadMore() {
    this.productService.getAllActiveProductsForCompanySync(this.shopSlug, this.nextPage).subscribe(data => {
      if (data && data.length) {
        this.products.push(...data);
        this.nextPage = data[data.length - 1]?.Id || 99999999;
        this.showShowMore = data.length >= MAX_PAGE_SIZE;
      }
    });

  }
  // getCompany() {
  //   this.companyService.getCompanyById(this.shopSlug).subscribe(data => {
  //     if (data && data.CompanyId) {
  //       this.company = data;

  //     }
  //   });


  // }

  viewMore(product: Product) {
    if (product) {
      this.selectedProduct = product;
      return
      this.homeShopService.updateProductState(product);
      this.uxService.keepNavHistory(null);
      this.router.navigate(['shop/product', product.ProductSlug])
    }
  }
  selectCategory(category: Category) {
    if (category && category.IsShop) {
      this.homeShopService.updateCategoryState(category);
      this.router.navigate([`shop/collections/${category.Name}`])
    }

  }
  tapChildCategory(category: Category) {
    if (category) {
      this.products = this.products = this.allProducts.filter(x => x.CompanyId === this.company.CompanyId && x.CategoryGuid === category.CategoryId);
    }

  }
  all() {
    this.products = this.products = this.allProducts.filter(x => x.CompanyId === this.company.CompanyId);

  }

  goto(url) {
    this.router.navigate([url]);
  }




  onLike(like: string) {
    this.likeAction = like;
    if (!this.user) {
      this.uxService.openTheQuickLogin();
      this.pendingActionLike = true;
      return false;
    }
    this.liked = like;
    if (like === 'yes') {
      this.interaction = {
        InteractionId: "",
        InteractionType: "Like",
        InteractionSourceId: this.user.UserId,
        InteractionTargetId: this.company.CompanyId,
        TraceId: '1',
        InteractionBody: "Follow",
        Color: '',
        Size: '',
        Price: 0,
        Name: this.company.Name,
        Description: this.company.Description,
        InteractionStatus: "Valid",
        ImageUrl: this.company.Dp,
        SourceType: "",
        SourceName: this.user.Name,
        SourceDp: this.user.Dp,
        TargetType: "",
        TargetName: "",
        TargetDp: "",
        CreateUserId: this.user.UserId,
        ModifyUserId: this.user.UserId,
        StatusId: 1
      }

      this.interactionService.add(this.interaction).subscribe(data => {
        if (data && data.InteractionId) {
          this.getInteractions();
          this.pendingActionLike = false;
          this.uxService.showQuickMessage('Shop added to favorites.');
          this.getInteractionSync();
          this.getProducts(99999999);

        }
      })
    }

    if (like === 'no' && this.interaction && this.interaction.InteractionId && this.interaction.CreateDate) {
      this.interactionService.delete(this.interaction.InteractionId).subscribe(data => {
        this.company.Liked = false;
        this.uxService.showQuickMessage('Shop removed from favorites.');
        this.getInteractionSync();
        this.getInteractions();
        this.getProducts(99999999);
      });
    }


  }



  getInteractionSync() {
    if (!this.user) {
      return;
    }
    const interactionSearchModel: InteractionSearchModel = {
      InteractionSourceId: this.user.UserId,
      InteractionTargetId: '',
      InteractionType: INTERRACTION_TYPE_LIKE,
      StatusId: 1
    }
    this.interactionService.getInteractionsBySourceSync(interactionSearchModel);
  }

  getInteractions() {
    if (!this.user) {
      return false;
    }
    const interactionSearchModel: InteractionSearchModel = {
      InteractionSourceId: this.user.UserId,
      InteractionTargetId: this.company.CompanyId,
      InteractionType: INTERRACTION_TYPE_LIKE,
      StatusId: 1
    }
    this.interactionService.getInteractions(interactionSearchModel).subscribe(data => {
      if (data && data.length) {
        const liked = data.find(x => x.InteractionType === 'Like');
        if (liked) {
          this.interaction = liked;
          this.liked = 'yes';
        }
      }
    })
  }

  loadCategories() {
    const catergories = [];
    // this.parentCategories = [];
    // this.tertiaryCategories = [];

    this.productService.productListObservable.subscribe(products => {
      if (products && products.length) {
        const pro: Product = products.find(x => x.Company && x.Company.Slug === this.shopSlug || x.Company && x.Company.CompanyId === this.shopSlug);
        if (pro) {
          this.company = pro.Company;
          this.promotions = this.company.Promotions || [];
          this.promotions.map(x => x.Style = { background: x.Bg, color: x.Color });

          // alert(this.company.Name);
          this.getInteractions();
          this.getShopOwner();

          this.products = products.filter(x => x.CompanyId === this.company.CompanyId);
          this.allProducts = products.filter(x => x.CompanyId === this.company.CompanyId);
          this.products.forEach(product => {
            if (!catergories.find(x => x && x.CategoryId === product.CategoryGuid)) {
              if (product.Category) {
                catergories.push(product.Category);
              }
            }
            if (!this.parentCategories.find(x => x && x.CategoryId === product.ParentCategoryGuid)) {
              if (product.ParentCategory) {
                this.parentCategories.push(product.ParentCategory);
              }
            }
            if (!this.tertiaryCategories.find(x => x && x.CategoryId === product.TertiaryCategoryGuid)) {
              if (product.TertiaryCategory) {
                this.tertiaryCategories.push(product.TertiaryCategory);
              }
            }
          });

          if (catergories && catergories.length) {
            this.catergories = catergories;
          }
        }

      }
    });


  }

  tabParentCategories(category: Category) {
    console.log(category);
    if (category) {
      this.parentCategories.map(x => x.Class = ['']);
      category.Class = ['active'];
    }
  }
  gotoDashboard() {
    this.router.navigate(['admin/dashboard'])
  }

}
