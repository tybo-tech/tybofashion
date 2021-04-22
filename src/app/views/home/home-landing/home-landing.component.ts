import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category, NavigationModel, User } from 'src/models';
import { AccountService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';
import { ADMIN } from 'src/shared/constants';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-home-landing',
  templateUrl: './home-landing.component.html',
  styleUrls: ['./home-landing.component.scss']
})
export class HomeLandingComponent implements OnInit {
  selectedCategory: Category;
  currentNav: string;
  categories: Category[];
  isLoading = true;
  user: User;
  shopHander: string;
  navItems: NavigationModel[] = [];
  viewIndex = 0;
  showMobileNav = false;
  constructor(
    private homeShopService: HomeShopService,
    private router: Router,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute

  ) {

  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (this.user && this.user.UserType === ADMIN) {
      this.router.navigate(['admin/dashboard']);
    }
    this.homeShopService.categoryListObservable.subscribe(data => {
      if (data) {
        this.categories = data;
        const currentCategory = this.homeShopService.getCurrentParentCategoryValue;
        this.displayProducts(currentCategory && currentCategory.CategoryId || data[0].CategoryId);
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


    // this.homeShopService.getForShop().subscribe(data => {
    //   if (data && data.length) {
    //     data = this.homeShopService.createProductClasses(data);
    //     this.homeShopService.updateCategoryListState(data);
    //     this.isLoading = false;
    //   }
    // });



    // this.navItems.push(
    //   {
    //     Id: 'shops',
    //     Label: 'All Shops',
    //     Url: '',
    //     ImageUrl: '',
    //     Tooltip: '',
    //     Class: '',
    //   }
    // );

  }


  selectCategory(category: Category) {
    if (category) {
      this.toggleMenu(false);
      this.homeShopService.updateCategoryState(category);
      this.viewIndex = 1;
    }
  }


  onNavItemClicked(categoryId: string) {
    if (categoryId === 'shops') {
      this.router.navigate(['shops'])
      return
    }

    this.displayProducts(categoryId);
  }

  displayProducts(categoryId: string) {
    this.selectedCategory = this.categories.find(x => x.CategoryId === categoryId);
  }
  registerShop() { }
  navItemClicked(item: NavigationModel) {
    if (item) {
      this.viewIndex = 0;
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

  navAction(e) {
    this.viewIndex = 0;
    this.toggleMenu(false);
  }
  goto(url) {
    this.toggleMenu(false);
    if (!isNaN(url)) {
      this.viewIndex = url;
      return;
    }
    this.router.navigate([`home/${url}`]);
  }
  login() {
    this.router.navigate(['sign-in']);
  }

  toggleMenu(e) {
    this.showMobileNav = e;
  }
}
