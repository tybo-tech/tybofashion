import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Category, NavigationModel } from 'src/models';
import { AccountService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-home-side-nav',
  templateUrl: './home-side-nav.component.html',
  styleUrls: ['./home-side-nav.component.scss']
})
export class HomeSideNavComponent implements OnInit {
  // @Input() navItems;
  @Input() showMobileNav;
  @Input() user;
  @Output() showMobileMenuEvent: EventEmitter<any> = new EventEmitter<any>();
  categories: Category[];
  navItems: NavigationModel[];
  selectedCategory: Category;
  @Input() showExistShop: boolean;
  constructor(
    private router: Router,
    private homeShopService: HomeShopService,
    private uxService: UxService,
    private accountService: AccountService,

  ) { }

  ngOnInit() {

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

  
  }

  goto(event) {
    this.toggleMenu(false);
    this.router.navigate([event]);
  }
  toggleMenu(e) {
    this.showMobileMenuEvent.emit(e);
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
    // debugger
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
  logout() {
    this.user = null;
    this.accountService.updateUserState(null);
  }

  profile() {
    this.router.navigate(['home/profile']);
    this.showMobileNav = false;
  }

}
