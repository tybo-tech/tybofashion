import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, Product } from 'src/models';
import { HomeShopService } from 'src/services/home-shop.service';
import { TIMER_LIMIT_WAIT } from 'src/shared/constants';
import { ProductService } from 'src/services/product.service';
import { BreadModel } from 'src/models/UxModel.model';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit, AfterViewInit {

  product: Product;
  productSlug: string;
  totalPrice = 0;
  quantity = 0;
  catergoryId: string;
  catergory: Category;
  @Output() navAction: EventEmitter<boolean> = new EventEmitter<boolean>();
  parentCategories: any;
  currentCategory: Category;
  allProducts: Product[];
  products: any[];
  items: BreadModel[];

  heading = 'Instagram Picks';
  allUxisexProducts: Product[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private homeShopService: HomeShopService,
    private productService: ProductService,
    private router: Router,
    private location: Location,
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.catergoryId = r.id;
      this.loadCategories();
      window.scroll(0, 0);
    });
  }

  ngOnInit() {
  }


  loadCategories() {
    const catergories = [];
    this.products = [];
    this.allUxisexProducts = [];

    this.productService.productListObservable.subscribe(products => {
      if (products && products.length) {
        this.allProducts = products;
        const unisex = this.allProducts.find(x => x.ParentCategory && x.ParentCategory.Name === 'Unisex');
        if (unisex && unisex.ParentCategory) {
          this.allUxisexProducts = this.allProducts.filter(x => x.ParentCategoryGuid === unisex.ParentCategory.CategoryId);
        }
        this.parentCategories = this.allProducts.map(x => x.Category);

        // if (catergories && catergories.length) {
        //   this.catergories = catergories;
        // }
        this.currentCategory = this.allProducts.map(x => x.Category).find(x => x.CategoryId === this.catergoryId);
        if (this.currentCategory) {
          this.heading = `Shop ${this.currentCategory.Name}`;
        }
       
        this.products = this.allProducts.filter(x => x.CategoryGuid === this.catergoryId);
        if (this.catergoryId === 'Ladies' || this.catergoryId === 'Mens') {
          this.heading = `${this.catergoryId} collection`;
          this.products = this.allProducts.filter(x => x.ParentCategory && x.ParentCategory.Name === this.catergoryId);
        }
        if (this.catergoryId === 'picks') {
          this.products = this.allProducts.filter(x => x.PickId);
          this.heading = 'Instagram Picks';
        }



        this.items = [
          {
            Name: 'Home',
            Link: ''
          },
          {
            Name: this.heading,
            Link: 'home/collections/picks'
          }
        ];

      }

    });
    // console.log(this.parentCategories);

  }

  updateTotalPrice(quantity) {
    if (!quantity) {
      quantity = 1;
    }
    this.quantity = quantity;
  }
  onNavItemClicked(p) { }
  back() {
    this.location.back();
  }

  ngAfterViewInit(): void {
    if (this.product) {
      setTimeout(() => {
        this.scrollTo(this.product.ClassSelector);
      }, TIMER_LIMIT_WAIT)
    }
  }

  scrollTo(className: string) {
    const elementList = document.querySelectorAll('.' + className);
    if (elementList.length) {
      const element = elementList[0] as HTMLElement;
      element.scrollIntoView({ behavior: 'smooth' });
    }

  }

  viewMore(model: Product) {
    if (model) {
      this.homeShopService.updateProductState(model);
      this.homeShopService.updatePageMovesIntroTrueAndScrollOpen();

      // this.router.navigate([model.CompanyId]);
      this.router.navigate(['shop/product', model.ProductSlug || model.ProductId])


    }
  }
  gotoComapny(product: Product) {
    window.scroll(0, 0);
    if (product.Company) {
      this.router.navigate([product.Company.Slug || product.CompanyId]);
      return;
    }
    this.router.navigate([product.CompanyId]);
  }
}
