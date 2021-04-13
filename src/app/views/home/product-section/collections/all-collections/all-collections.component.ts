import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/models';
import { OrderService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';
import { PromotionService } from 'src/services/promotion.service';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-all-collections',
  templateUrl: './all-collections.component.html',
  styleUrls: ['./all-collections.component.scss']
})
export class AllCollectionsComponent implements OnInit {
  selectedCategory: import("c:/NDU/apps/tybo-invoice/src/models/category.model").Category;

  constructor(
    private router: Router,
    private homeShopService: HomeShopService,
    private orderService: OrderService,
    private uxService: UxService,
    private promotionService: PromotionService,
  ) { }

  ngOnInit() {
    this.homeShopService.parentCategoryObservable.subscribe(data => {
      this.selectedCategory = data;
    });
  }
  back() {
    // this.navAction.emit(true);
    this.router.navigate(['']);
  }

  selectCategory(category: Category) {

    if (category) {
      this.homeShopService.updateCategoryState(category);
      this.router.navigate([`home/collections/${category.Name}`])
    }
  }
}
