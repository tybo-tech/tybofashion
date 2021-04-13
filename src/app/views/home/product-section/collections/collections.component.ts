import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, Product } from 'src/models';
import { HomeShopService } from 'src/services/home-shop.service';
import { TIMER_LIMIT_WAIT } from 'src/shared/constants';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit , AfterViewInit{

  product: Product;
  productSlug: string;
  totalPrice = 0;
  quantity = 0;
  catergoryId: string;
  catergory: Category;
  @Output() navAction: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private homeShopService: HomeShopService,
    private router: Router,
    private location: Location,
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.catergoryId = r.id;
    });
  }

  ngOnInit() {
    this.homeShopService.categoryObservable.subscribe(data => {
      if (data) {
        this.catergory = data;
      } else {
        this.back();
      }
    });

    this.product = this.homeShopService.getCurrentProductValue;

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
  gotoShop(product: Product) {
    this.homeShopService.updateProductState(product);
    this.homeShopService.updatePageMovesIntroTrueFalse(true);
    this.router.navigate([product.Company && product.Company.Slug || product.CompanyId]);
  }
}
