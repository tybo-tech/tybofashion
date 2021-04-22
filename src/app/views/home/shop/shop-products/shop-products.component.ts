import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, Product, User } from 'src/models';
import { Company } from 'src/models/company.model';
import { Interaction, InteractionSearchModel } from 'src/models/interaction.model';
import { Promotion } from 'src/models/promotion.model';
import { NavHistoryUX } from 'src/models/UxModel.model';
import { AccountService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { HomeShopService } from 'src/services/home-shop.service';
import { InteractionService } from 'src/services/Interaction.service';
import { ProductService } from 'src/services/product.service';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-shop-products',
  templateUrl: './shop-products.component.html',
  styleUrls: ['./shop-products.component.scss']
})
export class ShopProductsComponent implements OnInit {

  @Input() promotions: Promotion[];
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

  constructor(
    private homeShopService: HomeShopService,
    private productService: ProductService,
    private uxService: UxService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private interactionService: InteractionService,
    private accountService: AccountService,

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.shopSlug = r.id;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.getCompany();



    this.uxService.uxNavHistoryObservable.subscribe(data => {
      this.navHistory = data;
    })


  }
  getCompany() {
    this.companyService.getCompanyById(this.shopSlug).subscribe(data => {
      if (data && data.CompanyId) {
        this.company = data;
        this.loadCategories();
        this.getInteractions();
      }
    });
  }

  viewMore(product: Product) {
    if (product) {
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
    if (!this.user) {
      this.uxService.keepNavHistory(
        {
          BackToAfterLogin: `/${this.company.Slug || this.company.CompanyId}`,
          BackTo: this.navHistory && this.navHistory.BackTo || null,
          ScrollToProduct: null
        }
      );
      this.showAdd = true;
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
        InteractionBody: "1",
        Color: '',
        Size: '',
        Price: 0,
        Name: this.company.Name,
        Description: this.company.Description,
        InteractionStatus: "Valid",
        ImageUrl: this.company.Dp,
        CreateUserId: this.user.UserId,
        ModifyUserId: this.user.UserId,
        StatusId: 1
      }

      this.interactionService.add(this.interaction).subscribe(data => {
        console.log(data);
      })
    }

    if (like === 'no' && this.interaction.InteractionId && this.interaction.CreateDate) {
      this.interactionService.delete(this.interaction.InteractionId).subscribe(data => {
        console.log(data);
      })
    }


  }

  getInteractions() {
    if (!this.user) {
      return false;
    }
    const interactionSearchModel: InteractionSearchModel = {
      InteractionSourceId: this.user.UserId,
      InteractionTargetId: this.company.CompanyId,
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
        this.allProducts = products;
        this.products = this.allProducts.filter(x => x.CompanyId === this.company.CompanyId);
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



    // const cat = this.homeShopService.getCurrentParentCategoryValue;
    // if (cat) {
    //   this.tabParentCategories(cat);
    // } else {
    //   this.tabParentCategories(this.parentCategories[0]);
    // }

  }

  tabParentCategories(category: Category) {
    console.log(category);
    if (category) {
      this.parentCategories.map(x => x.Class = ['']);
      category.Class = ['active'];
      // this.homeShopService.updateParentCategoryState(category);
    }
  }
}
