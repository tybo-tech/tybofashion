import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Category, NavigationModel, Order, Product, User } from 'src/models';
import { Company } from 'src/models/company.model';
import { SearchResultModel } from 'src/models/search.model';
import { AccountService, CompanyCategoryService, OrderService, ProductService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { HomeShopService } from 'src/services/home-shop.service';
import { NavigationService } from 'src/services/navigation.service';
import { UxService } from 'src/services/ux.service';
import { COMPANY_TYPE, ORDER_TYPE_SALES } from 'src/shared/constants';

@Component({
  selector: 'app-home-nav',
  templateUrl: './home-nav.component.html',
  styleUrls: ['./home-nav.component.scss']
})
export class HomeNavComponent implements OnInit {
  showMenu: boolean;
  selectedCategory: Category;
  allCategories: Category[];
  parentCategories: Category[];
  subCatergories: Category[] = [];
  logoUx: any;
  carttItems = 0;
  allProducts: Product[]
  order: Order;
  user: User;
  searchString: string;
  searchResults: SearchResultModel[] = [];
  showSearch: boolean;
  products: any;
  catergories: any[];
  tertiaryCategories: any[];
  shops: Company[];
  companies: Company[];
  constructor(
    private navigationService: NavigationService,
    private accountService: AccountService,
    private orderService: OrderService,
    private homeShopService: HomeShopService,
    private router: Router,
    private uxService: UxService,
    private productService: ProductService,
    private companyCategoryService: CompanyCategoryService,

  ) {

  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.accountService.user.subscribe(user => {
      this.user = user;
    });



    this.orderService.OrderObservable.subscribe(data => {
      this.order = data;
      if (this.order) {
        this.carttItems = this.order.Orderproducts && this.order.Orderproducts.length || 0;
      }
    });


    this.uxService.navBarLogoObservable.subscribe(data => {
      if (data) {
        this.logoUx = data;
      } else {
        this.logoUx = {
          Name: '',
          LogoUrl: `assets/images/common/logoblack2.png`
        }
      }
    });
    this.uxService.uxHomeSideNavObservable.subscribe(data => {
      this.showMenu = data;
    })

    this.getCategories();
  }

  getCategories() {

    this.companyCategoryService.getSystemCategories(COMPANY_TYPE, 'All');
    this.companyCategoryService.systemCategoryListObservable.subscribe(data => {
      if (data && data.length) {
        this.allCategories = data;
      }
    });
  }

  tabParentCategories(category: Category) {
    console.log(category);
    if (category) {
      this.parentCategories.map(x => x.Class = ['']);
      category.Class = ['active'];
      this.homeShopService.updateParentCategoryState(category);
    }
  }


  goto(url: string) {
    this.totop();
    this.router.navigate([url]);
    // if (url === '') {
    //   this.loadData();
    // }
  }

  toggle() {
    this.showMenu = !this.showMenu;
  }

  search() {
    this.searchResults = [];
    if (this.allProducts && this.searchString) {
      this.searchString = this.searchString.toLocaleLowerCase();
      const matchingProducts = this.allProducts.filter(x => {
        if (
          x.Name && x.Name.toLocaleLowerCase().includes(this.searchString)
          || x.Description && x.Description.toLocaleLowerCase().includes(this.searchString)
        ) {
          return x;
        }
      });
      matchingProducts.forEach(x => {

        this.searchResults.push(
          {
            Name: x.Name,
            RegularPrice: x.RegularPrice,
            Icon: x.FeaturedImageUrl,
            Object: x,
            Type: 'product'
          }
        );
      })
    }

  }

  openSearchResult(item: SearchResultModel) {
    if (!item) {
      return;
    }
    this.showSearch = false;

    if (item.Type === 'product') {
      this.viewMore(item.Object);
      this.searchString = undefined;
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
      this.router.navigate(['shop/product', model.ProductSlug || model.ProductId])

    }
  }

  totop() {
    window.scroll(0, 0);
  }


}
