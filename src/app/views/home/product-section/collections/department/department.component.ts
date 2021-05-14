import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, User, Category } from 'src/models';
import { NavHistoryUX } from 'src/models/UxModel.model';
import { ProductService, AccountService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  searchString:string;
  products: Product[];
  allProducts: Product[];
  user: User;
  navHistory: NavHistoryUX;
  showAdd: boolean;
  parentCategories: Category[] = [];
  catergories: Category[] = [];
  tertiaryCategories: Category[] = [];
  parentCategory: Category;
  pickedProducts: Product[];
  newProducts: Product[];
  parentCategoryId: any;
  allUxisexProducts: Product[];

  constructor(
    private homeShopService: HomeShopService,
    private productService: ProductService,
    private uxService: UxService,
    private router: Router,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,


  ) {
    this.activatedRoute.params.subscribe(r => {
      this.parentCategoryId = r.id;
      this.loadCategories();
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.uxService.uxNavHistoryObservable.subscribe(data => {
      this.navHistory = data;
    })

  }

  viewMore(product: Product) {
    if (product) {
      this.uxService.keepNavHistory({
        BackToAfterLogin: '',
        BackTo: '',
        ScrollToProduct: null
      });
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
      this.products = this.products = this.allProducts.filter(x => x.CategoryGuid === category.CategoryId);
    }

  }
  all() {
    this.products = this.products = this.allProducts;

  }

  goto(url) {
    this.router.navigate([url]);
  }



  loadCategories() {
    const catergories = [];
    this.newProducts = [];

    this.productService.productListObservable.subscribe(products => {
      if (products && products.length) {
        this.allProducts = products;
        const parent = this.allProducts.find(x => x.ParentCategory && x.ParentCategory.Name === this.parentCategoryId);
        this.products = this.allProducts;
        if (parent && parent.ParentCategory) {
          this.parentCategory = parent.ParentCategory;
          this.products = this.allProducts.filter(x => x.ParentCategoryGuid === this.parentCategory.CategoryId);
        }
        const unisex = this.allProducts.find(x => x.ParentCategory && x.ParentCategory.Name === 'Unisex');
        if (unisex && unisex.ParentCategory) {
          this.allUxisexProducts = this.allProducts.filter(x => x.ParentCategoryGuid === unisex.ParentCategory.CategoryId);
        }
        let i = 0;
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
    });
    console.log(this.parentCategories);
    this.parentCategory = this.parentCategories.find(x => x.Name === this.parentCategoryId);

    // this.pickedProducts = this.allProducts.filter(x => x.PickId);
    const unisexCategory = this.parentCategories.find(x => x.Name === "Unisex");
    if (unisexCategory) {
      this.newProducts = this.allProducts.filter(x => x.ParentCategoryGuid === unisexCategory.CategoryId);

    } else {
      this.newProducts = [];

    }



  }

  tabParentCategories(category: Category) {
    console.log(category);
    if (category) {
      this.parentCategories.map(x => x.Class = ['']);
      category.Class = ['active'];
    }
  }

  gotoComapny(product:Product){
    window.scroll(0,0);
    if(product.Company){
      this.router.navigate([product.Company.Slug || product.CompanyId]);
      return;
    }
    this.router.navigate([product.CompanyId]);
  }

}
