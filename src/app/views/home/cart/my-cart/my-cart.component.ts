import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Order, Orderproduct } from 'src/models';
import { OrderService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.scss']
})
export class MyCartComponent implements OnInit {

  order: Order;
  @Output() checkoutOrShopMoreEvent: EventEmitter<string> = new EventEmitter<string>();
  product: import("c:/NDU/apps/tybo-invoice/src/models/product.model").Product;

  constructor(
    private orderService: OrderService,
    private homeShopService: HomeShopService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.order = this.orderService.currentOrderValue;
    this.product = this.homeShopService.getCurrentProductValue;

  }


  continueShopping() {
    this.orderService.updateOrderState(this.order);
    this.back();
    // this.checkoutOrShopMoreEvent.emit('shopmore');
    // this.router.navigate([`${this.order.Company.Slug}`]);

  }
  checkout() {
    if (this.order) {
      this.router.navigate(['shop/checkout']);
    }
  }
  back() {
    if (this.product) {
      this.router.navigate([this.product.CompanyId]);
      return;
    }

  this.router.navigate(['']);
    return;

  }

  deleteItem(item: Orderproduct, i) {
    this.order.Total -= Number(item.UnitPrice);
    this.order.Orderproducts.splice(i, 1);
    this.orderService.updateOrderState(this.order);

  }
}
