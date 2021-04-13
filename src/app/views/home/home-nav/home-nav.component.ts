import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Category, NavigationModel, Order, Product, User } from 'src/models';
import { SearchResultModel } from 'src/models/search.model';
import { AccountService, OrderService } from 'src/services';
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

  toolbarItems: NavigationModel[];
  @Input() showNav: boolean;
  @Output() navAction: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedItem: EventEmitter<string> = new EventEmitter<string>();
  @Output() showMobileMenuEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() navItemClickedEvent: EventEmitter<NavigationModel> = new EventEmitter<NavigationModel>();

  Nature: string;
  Hiphop = 'Hip hop';
  Luxury: string;
  Sites: string;
  showMenu: boolean;
  user: User;
  carttItems = 0;
  showModal: boolean;
  order: Order;
  category: Category;
  categories: Category[];
  //new 
  searchString: string;
  searchResults: SearchResultModel[] = [];
  allProducts: Product[]
  logoUx: any;
  navItems;
  showSearch: boolean;
  selectedCategory: Category;


  constructor(
    private navigationService: NavigationService,
    private accountService: AccountService,
    private orderService: OrderService,
    private homeShopService: HomeShopService,
    private router: Router,
    private uxService: UxService,

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
    this.categories = this.homeShopService.getCurrentCategoryListValue;

    if (this.categories && this.categories.length) {
      this.homeShopService.parentCategoryObservable.subscribe(category => {
        if (category) {
          this.categories.map(x => x.ShowChildren = false);
          this.categories.map(x => x.Class = []);
          if (this.categories.find(x => x.CategoryId === category.CategoryId)) {
            this.categories.find(x => x.CategoryId === category.CategoryId).ShowChildren = true;
            this.categories.find(x => x.CategoryId === category.CategoryId).Class = ['active'];
          }
        } else {
          this.categories[0].ShowChildren = true;
          this.categories[0].Class = ['active'];
        }
      });

      this.homeShopService.categoryListObservable.subscribe(data => {
        if (data) {
          this.categories = data;
          this.navItems = [];
          if (!this.selectedCategory) {
            this.selectedCategory = this.categories && this.categories.length && this.categories[0];
          }

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

          if (this.homeShopService.getCurrentParentCategoryValue
            && this.homeShopService.getCurrentParentCategoryValue.CategoryId) {
            this.navItems.find(x => x.Id === this.homeShopService.getCurrentParentCategoryValue.CategoryId).Class = 'active';
          } else {
            this.navItems[0].Class = 'active';
          }
        }
      });

    }

    if (this.order) {
      this.carttItems = this.order.Orderproducts && this.order.Orderproducts.length || 0;
    }



    this.navigationService.getToolbarNavigation().subscribe(data => {
      if (data.length > 0) {
        this.toolbarItems = data;
      }
    });

    // new 

    if (this.categories && this.categories.length) {
      this.allProducts = this.homeShopService.isolateProductsFromCategories(this.categories);
    }
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



    this.homeShopService.parentCategoryObservable.subscribe(data => {
      if (data) {
        this.selectedCategory = data;
      } else {
        this.selectedCategory = this.categories && this.categories.length && this.categories[0];
      }

      if (this.selectedCategory.Children && this.selectedCategory.Children.length) {
        this.selectedCategory.Children.sort(function (a, b) {
          var textA = a.Name.toString();
          var textB = b.Name.toString();;
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
      }
    });
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
      // this.router.navigate([model.Company && model.Company.Slug || model.CompanyId]);
      this.router.navigate(['shop/product', model.ProductSlug || model.ProductId])

    }
  }


  actionClick() {
    // this.navAction.emit(true);
  }
  navItemClicked(item: NavigationModel) {
    if (item) {
      this.navItemClickedEvent.emit(item);
    }

  }
  login() {
    this.router.navigate(['home/sign-in']);
  }
  profile() {
    this.router.navigate(['home/profile']);
  }
  register() {
    this.router.navigate(['home/sign-up']);
  }
  contact() {
    this.router.navigate(['home/contact']);
  }
  sell() {
    this.router.navigate(['home/hello-fashion-shop']);
  }

  toggle() {
    this.showMobileMenuEvent.emit(true);
  }

  logout() {
    this.user = null;
    this.accountService.updateUserState(null);
  }
  cart() {
    this.router.navigate(['shop/cart']);

  }
  checkout() {
    this.router.navigate(['home/checkout']);
  }
  orders() {
    this.router.navigate(['home/my-orders']);
  }

  closeModal() {
    this.order = this.orderService.currentOrderValue;
    if (this.order) {
      this.carttItems = this.order.Orderproducts && this.order.Orderproducts.length || 0;
    }
    this.showModal = false;
    // this.showAddCustomer = false;
  }
  showChildren(category: Category) {
    this.categories.map(x => x.ShowChildren = false);
    this.categories.map(x => x.Class = []);
    category.ShowChildren = true;
    category.Class = ['active'];
    this.homeShopService.updateParentCategoryState(category);
  }
  selectCategory(category: Category) {
    if (category) {
      this.homeShopService.updateCategoryState(category);
    }
  }
  dashboard() {
    this.router.navigate(['admin/dashboard']);
  }

  parentNavItemClicked(item: NavigationModel) {
    if (item) {
      this.navItems.map(x => x.Class = '');
      item.Class = 'active';
      const categoryId = item.Id;
      const selectedCategory = this.categories.find(x => x.CategoryId === categoryId);
      if (selectedCategory) {
        this.homeShopService.updateParentCategoryState(selectedCategory);
      }
    }
  }

  childCategoryselected(category: Category) {
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
  goto(event) {
    // this.toggleMenu(false);
    this.router.navigate([event]);
  }
}
