import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Category, NavigationModel, Order, Product, User } from 'src/models';
import { SearchResultModel } from 'src/models/search.model';
import { AccountService, OrderService, ProductService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';
import { NavigationService } from 'src/services/navigation.service';
import { UxService } from 'src/services/ux.service';
import { ORDER_TYPE_SALES } from 'src/shared/constants';

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
  constructor(
    private navigationService: NavigationService,
    private accountService: AccountService,
    private orderService: OrderService,
    private homeShopService: HomeShopService,
    private router: Router,
    private uxService: UxService,
    private productService: ProductService,

  ) {

  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.accountService.user.subscribe(user => {
      this.user = user;
    });

    // this.loadData();
    this.loadAllProducts();

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

  }


  loadAllProducts() {
    this.productService.getAllActiveProductsSync().subscribe(data => {
      if (data) {
        this.products = data
        this.allProducts = data;
        this.productService.updateProductListState(this.allProducts);
        this.loadCategories(this.allProducts);
      }
    });
  }

  loadCategories(products: Product[]) {
    this.catergories = [];
    this.parentCategories = [];
    this.tertiaryCategories = [];

    products.forEach(product => {
      if (!this.catergories.find(x => x && x.CategoryId === product.CategoryGuid)) {
        if (product.Category) {
          this.catergories.push(product.Category);
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



    // this.products.map(x => x.Category = null);
    // this.products.map(x => x.ParentCategory = null);
    // this.products.map(x => x.TertiaryCategory = null);
    const cat = this.homeShopService.getCurrentParentCategoryValue;
    if (cat) {
      this.tabParentCategories(cat);
    } else {
      this.tabParentCategories(this.parentCategories[0]);
    }

  }


  // loadData() {
  //   this.uxService.updateLoadingState({ Loading: true, Message: 'Loading product, please wait...' });

  //   this.homeShopService.getForShop().subscribe(data => {
  //     if (data && data.length) {
  //       this.allCategories = data;
  //       this.parentCategories = this.allCategories;
  //       this.selectedCategory = this.parentCategories[0];

  //       data = this.homeShopService.createProductClasses(this.allCategories);
  //       this.homeShopService.updateCategoryListState(this.allCategories);
  //       this.uxService.updateLoadingState({ Loading: false, Message: undefined });
  //     }
  //   });
  // }

  tabParentCategories(category: Category) {
    console.log(category);
    if (category) {
      this.parentCategories.map(x => x.Class = ['']);
      category.Class = ['active'];
      this.homeShopService.updateParentCategoryState(category);
    }
  }
  tabChildCategories(category: Category) {
    if (category && category.IsShop) {
      category.Class = ['active'];
      this.homeShopService.updateCategoryState(category);
      this.goto(`shop/collections/${category.Name}`)
    }
    if (category && !category.IsShop) {
      category.Class = ['active'];
      this.homeShopService.updateCategoryState(category);
      this.goto(`home/collections/${category.Name}`)
    }
    // this.toggleMenu(false);
  }

  goto(url: string) {
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
        if (x.Name && x.Name.toLocaleLowerCase().includes(this.searchString)) {
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




}
