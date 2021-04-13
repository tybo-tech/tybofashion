import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Category, NavigationModel, Order, Product } from 'src/models';
import { Promotion } from 'src/models/promotion.model';
import { OrderService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';
import { PromotionService } from 'src/services/promotion.service';
import { UxService } from 'src/services/ux.service';
import { ORDER_TYPE_SALES, TIMER_LIMIT_WAIT } from 'src/shared/constants';

@Component({
  selector: 'app-product-section',
  templateUrl: './product-section.component.html',
  styleUrls: ['./product-section.component.scss']
})
export class ProductSectionComponent implements OnInit, AfterViewInit {
  // @Input() selectedCategory: Category;
  categories: Category[];
  @Output() selectCategoryEvent: EventEmitter<Category> = new EventEmitter<Category>();
  searchString: string;
  navItems: NavigationModel[] = [];
  product: any;
  allProducts: Product[]
  selectedCategory: Category;
  isLoading: boolean;
  showIntroPage: string;
  promotions: Promotion[] = [];
  currentSlideIndex = 0;
  timerId: number;
  constructor(
    private router: Router,
    private homeShopService: HomeShopService,
    private orderService: OrderService,
    private uxService: UxService,
    private promotionService: PromotionService,


  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.uxService.updateLoadingState({ Loading: true, Message: 'Loading product, please wait...' });

    this.homeShopService.getForShop().subscribe(data => {
      if (data && data.length) {
        data = this.homeShopService.createProductClasses(data);
        this.homeShopService.updateCategoryListState(data);
        this.isLoading = false;
        this.uxService.updateLoadingState({ Loading: false, Message: undefined });
      }
    });
    this.homeShopService.parentCategoryObservable.subscribe(data => {
      this.selectedCategory = data;
      this.loadPromationsPrices();

    });
    this.homeShopService.categoryListObservable.subscribe(data => {
      this.categories = data;
    });
    this.product = this.homeShopService.getCurrentProductValue;

    if (this.categories) {
      this.allProducts = this.homeShopService.isolateProductsFromCategories(this.categories);
      this.categories.forEach(item => {
        this.navItems.push({
          Id: item.CategoryId,
          Label: item.Name,
          Url: '',
          ImageUrl: '',
          Tooltip: '',
          Class: '',
        });
      });
      this.navItems.push(
        {
          Id: 'shops',
          Label: 'All Shops',
          Url: '',
          ImageUrl: '',
          Tooltip: '',
          Class: '',
        }
      );



    }
    this.uxService.updateNavBarLogoState({
      Name: '',
      LogoUrl: `assets/images/common/logoblack2.png`
    });

    this.uxService.showIntroPageObservable.subscribe(data => {
      this.showIntroPage = data;
    });

    if (!this.homeShopService.getCurrentProductValue) {
      this.uxService.updateShowIntroPageState('show');
    }
    this.promotionService.getAllActivePromotions().subscribe(data => {
      this.promotions = data || [];
      this.promotions = this.promotions.filter(promo => promo.ImageUrl && promo.ImageUrl.length);
      this.loadPromationsPrices();

    });

    setInterval(() => {
      this.doThePromoSlideShow();
    }, 10000);
  }

  ngAfterViewInit(): void {
    if (this.product) {
      setTimeout(() => {
        this.scrollTo(this.product.ClassSelector);
      }, TIMER_LIMIT_WAIT)
    }
  }

  doThePromoSlideShow() {
    if (this.promotions) {
      this.currentSlideIndex++;
      const item = this.promotions[this.currentSlideIndex];
      if (item) {
        this.promotions.map(promo => promo.Class = ['not-showing']);
        this.promotions[this.currentSlideIndex].Class = ['showing']
      } else {
        this.promotions.map(promo => promo.Class = ['not-showing']);
        this.currentSlideIndex = 0;
        this.promotions[this.currentSlideIndex].Class = ['showing']

      }
    }
  }
  loadPromationsPrices() {
    if (this.promotions && this.promotions.length && this.selectedCategory && this.selectedCategory.Children) {
      this.promotions.map(promo => promo.Class = ['not-showing']);
      this.promotions[this.currentSlideIndex].Class = ['showing']
      this.selectedCategory.Children.forEach(child => {
        if (child.Products) {
          child.Products.forEach(product => {
            const promotion = this.promotions.find(x => x.CompanyId === product.CompanyId);
            if (promotion) {
              product.SalePrice = Number(product.RegularPrice) - (Number(product.RegularPrice) * (Number(promotion.DiscountValue) / 100));
              if (Number(product.SalePrice) < Number(product.RegularPrice)) {
                product.OnSale = true;
              }
            }

          })
        }
      });
      this.selectedCategory.Tertiary.forEach(child => {
        if (child.Products) {
          child.Products.forEach(product => {
            const promotion = this.promotions.find(x => x.CompanyId === product.CompanyId);
            if (promotion) {
              product.SalePrice = Number(product.RegularPrice) - (Number(product.RegularPrice) * (Number(promotion.DiscountValue) / 100));
              if (Number(product.SalePrice) < Number(product.RegularPrice)) {
                product.OnSale = true;
              }
            }
          })
        }
      });


      // this.timerId = setInterval(() => {
      //   if (this.currentSlideIndex > this.promotions.length - 1) {
      //     this.currentSlideIndex = 0;
      //   }
      //   this.promotions.map(promo => promo.Class = ['not-showing']);
      //   this.promotions[this.currentSlideIndex].Class = ['showing'];
      //   console.log(this.promotions);
      //   this.currentSlideIndex++;

      // }, 7000);
    }
  }
  selectCategory(category: Category) {

    if (category) {
      this.homeShopService.updateCategoryState(category);
      this.router.navigate([`home/collections/${category.Name}`])
    }
  }

  viewMore(model: Product) {
    const order = this.orderService.currentOrderValue;
    if (!order) {
      this.orderService.updateOrderState({
        OrdersId: '',
        OrderNo: 'Shop',
        CompanyId: model.CompanyId,
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
      });
    }
    if (model) {
      this.homeShopService.updateProductState(model);
      this.homeShopService.updatePageMovesIntroTrueAndScrollOpen();
      this.uxService.keepNavHistory('home');
      // this.router.navigate([model.Company.Slug]);
      this.router.navigate(['shop/product', model.ProductSlug || model.ProductId])
    }
  }

  registerShop() {
    this.router.navigate(['/home/hello-fashion-shop']);
  }

  gotoShop(product: Product) {
    this.homeShopService.updateProductState(product);
    this.homeShopService.updatePageMovesIntroTrueFalse(true);
    this.router.navigate([product.Company && product.Company.Slug || product.CompanyId]);
  }

  navItemClicked(item: NavigationModel) {
    if (item) {
      this.navItems.map(x => x.Class = '');
      item.Class = 'active';
      const categoryId = item.Id;
      if (categoryId === 'shops') {
        this.router.navigate(['shops'])
        return
      }
      this.selectedCategory = this.categories.find(x => x.CategoryId === categoryId);
      this.homeShopService.updateParentCategoryState(this.selectedCategory);
    }
  }

  scrollTo(className: string) {
    const elementList = document.querySelectorAll('.' + className);
    if (elementList.length) {
      const element = elementList[0] as HTMLElement;
      element.scrollIntoView({ behavior: 'smooth' });
    }

  }

  gotoShopPromotion(promotion: Promotion) {
    this.router.navigate([promotion.CompanyId]);
  }

  changeSlide(e){
    console.log(e);
    
  }
}
