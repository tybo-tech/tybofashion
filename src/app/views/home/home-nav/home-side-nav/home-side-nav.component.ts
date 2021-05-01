import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Category, NavigationModel, User } from 'src/models';
import { AccountService, ProductService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-home-side-nav',
  templateUrl: './home-side-nav.component.html',
  styleUrls: ['./home-side-nav.component.scss']
})
export class HomeSideNavComponent implements OnInit {
  // @Input() navItems;
  showMobileNav = true;
  @Output() showMobileMenuEvent: EventEmitter<any> = new EventEmitter<any>();
  categories: Category[];
  subCatergories: Category[];
  navItems: NavigationModel[];
  selectedCategory: Category;
  @Input() showExistShop: boolean;
  user: User;
  parentCategory: Category;
  constructor(
    private router: Router,
    private homeShopService: HomeShopService,
    private uxService: UxService,
    private accountService: AccountService,
    private productService: ProductService,

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.homeShopService.categoryListObservable.subscribe(data => {
      if (data) {
        this.categories = data;
        const currentCategory = this.homeShopService.getCurrentParentCategoryValue || this.categories[0];
        this.navItems = [];
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

    this.homeShopService.parentCategoryObservable.subscribe(data => {

      if (data) {
        this.selectedCategory = data;
      } else {
        this.selectedCategory = this.categories && this.categories.length && this.categories[0];
      }
    });
    // this.loadCategories();

  }

  goto(event) {
    this.toggleMenu(false);
    this.router.navigate([event]);
  }
  toggleMenu(e) {
    this.uxService.hideHomeSideNav();
  }
  childCategoryselected(category: Category) {
    if (category && category.IsShop) {
      this.homeShopService.updateCategoryState(category);
      this.goto(`shop/collections/${category.Name}`)
    }
    if (category && !category.IsShop) {
      this.homeShopService.updateCategoryState(category);
      this.goto(`home/collections/${category.Name}`)
    }
    this.toggleMenu(false);
  }



  parentNavItemClicked(item: NavigationModel) {
    if (item) {
      this.navItems.map(x => x.Class = '');
      item.Class = 'active';
      const categoryId = item.Id;
      const selectedCategory = this.categories.find(x => x.CategoryId === categoryId);
      if (selectedCategory) {
        this.homeShopService.updateParentCategoryState(selectedCategory);
        this.toggleMenu(false);
        this.router.navigate([`home/all-collections`, selectedCategory.Name.toLocaleLowerCase()]);
      }
    }
  }
  logout() {
    this.user = null;
    this.accountService.updateUserState(null);
  }

  profile() {
    this.router.navigate(['home/profile']);
    this.showMobileNav = false;
  }




  tabParentCategories(category: Category) {
    console.log(category);
    if (category) {
      this.subCatergories.map(x => x.Class = ['']);
      category.Class = ['active'];
    }
  }

  loadCategories(name: string) {
    if (this.parentCategory && this.parentCategory.Name === name && this.subCatergories) {
      this.subCatergories = [];
      this.parentCategory = undefined;
      return;
    }
    this.subCatergories = [];
    this.parentCategory = undefined;
    this.productService.productListObservable.subscribe(products => {
      if (products && products.length) {
        const parentCategories = products.map(x => x.ParentCategory);
        this.parentCategory = parentCategories.find(x => x.Name === name);
        if (this.parentCategory) {
          const categories = products.map(x => x.Category);
          categories.forEach(item => {
            if (item.ParentId === this.parentCategory.CategoryId && !this.subCatergories.find(x => x.CategoryId === item.CategoryId)) {
              this.subCatergories.push(item);
            }

          });
        }

        // this.currentCategory = this.parentCategories.find(x => x.Name === "Unisex");
        // this.products = this.allProducts.filter(x => x.PickId);
      }

    });
  }

  tapChildCategory(category: any) {
    if (category && category.CategoryId) {
      this.goto(`home/collections/${category.CategoryId}`);
      return;
    }

    //string
    this.goto(`home/collections/${category}`)

  }
}
