import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, Orderproduct, User } from 'src/models';
import { Shipping } from 'src/models/shipping.model';
import { AccountService } from 'src/services';
import { OrderService } from 'src/services/order.service';
import { Location } from '@angular/common';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.scss']
})
export class CartItemsComponent implements OnInit {
  @Input() order: Order;
  @Input() hideDelete;
  @Input() shippings: Shipping[];
  @Input() Class: string[];
  user: User;
  showAdd;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private accountService: AccountService,
    private location: Location,
    private uxService: UxService,

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (this.shippings && this.shippings.length) {
      if (this.order && this.order.Shipping) {
        const ship = this.shippings.find(x => x.Name === this.order.Shipping);
        if (ship) {
          this.selectShipping(ship);
        }
      } else {
        const courier = this.shippings.find(x => x.ShippingId === 'courier');
        if (courier) {
          this.selectShipping(courier);
        }
      }
    }
  }
  back() {
    this.location.back();
  }

  deleteItem(item: Orderproduct, i) {
    this.order.Total -= Number(item.UnitPrice);
    this.order.Orderproducts.splice(i, 1);
    if (this.order.Orderproducts.length === 0) {
      this.order.Shipping = undefined;
      this.order.ShippingPrice = undefined;
    }
    this.orderService.updateOrderState(this.order);
    this.order = this.orderService.currentOrderValue;
  }
  selectShipping(shipping: Shipping) {
    if (shipping) {
      this.shippings.map(x => x.Selected = false);
      shipping.Selected = true;
      this.order.ShippingPrice = shipping.Price;
      this.order.Shipping = shipping.Name;
      this.calculateTotalOverdue();
      this.order.Total = Number(this.order.Total) + Number(shipping.Price);
      this.orderService.updateOrderState(this.order);
      this.showAdd = false;
    }
  }

  calculateTotalOverdue() {
    this.order.Total = 0;
    this.order.Orderproducts.forEach(line => {
      this.order.Total += (Number(line.UnitPrice) * Number(line.Quantity));
    });

  }
  profile() {
    this.uxService.keepNavHistory({
      BackToAfterLogin: '/shop/checkout',
      BackTo: null,
      ScrollToProduct: null,
    });
    this.router.navigate(['home/edit-myprofile'])
  }

  updateOrder() {
    this.orderService.updateOrderState(this.order);
  }
}
