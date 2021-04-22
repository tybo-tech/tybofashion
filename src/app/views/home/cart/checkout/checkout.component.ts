import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Order, User } from 'src/models';
import { Shipping, systemShippings } from 'src/models/shipping.model';
import { AccountService, OrderService } from 'src/services';
import { ShippingService } from 'src/services/shipping.service';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  @Output() navAction: EventEmitter<boolean> = new EventEmitter<boolean>();

  rForm: FormGroup;
  user: User;
  order: Order;
  isGuest: boolean;
  companyId: string;
  productName = '';
  productDescription = '';
  merchantId = '15863973';
  merchantKey = 'xbamuwn3paoji';
  shopingSuccesfulUrl: string;
  paymentCallbackUrl: string;
  paymentCancelledUrl: string;
  shippings: Shipping[];
  constructor(
    private accountService: AccountService,
    // private shoppingService: ShoppingService,
    private router: Router,
    private orderService: OrderService,
    private uxService: UxService,


  ) {

  }
  ngOnInit(): void {

    this.order = this.orderService.currentOrderValue;
    if (!this.order) {
      alert('No rder data');
      this.back();
    }
    this.user = this.accountService.currentUserValue;
    if (this.user && !this.order.CustomerId) {
      this.order.CustomerId = this.user.UserId;
    }
    if (!this.order.CustomerId) {
      this.order.CustomerId = 'pending';

      this.orderService.updateOrderState(this.order);
      this.router.navigate(['home/sign-in']);
    }
    this.companyId = this.order.CompanyId;
    this.shopingSuccesfulUrl = `${environment.BASE_URL}/home/shopping-succesful/${this.companyId}`;
    this.paymentCancelledUrl = `${environment.BASE_URL}/home/payment-cancelled/${this.companyId}`;
    this.paymentCallbackUrl = `${environment.BASE_URL}/home/payment-callback`;
    this.productName = this.order.Orderproducts.map(x => x.ProductName).toString();
    this.productDescription = this.productName;
    if (this.productName.length > 100) {
      this.productName = this.productName.substring(0, 99);
    }
    if (this.productDescription.length > 255) {
      this.productDescription = this.productDescription.substring(0, 254);
    }
    this.laodShipping();
  }
  contineuAsGuest() {
    this.isGuest = true;
  }

  back() {
    if (this.order && this.order.CompanyId) {
      this.router.navigate([this.order.CompanyId]);
      return;
    }
    this.router.navigate(['']);
  }
  goto(url) {
    this.uxService.keepNavHistory({
      BackToAfterLogin: '/shop/checkout',
      BackTo: null,
      ScrollToProduct: null,
    });
    this.router.navigate([url]);
  }
  payments() {
    this.router.navigate(['at', this.companyId]);
  }

  laodShipping() {
    this.shippings = systemShippings;
    // this.shippingService.getShippingsSync(this.order && this.order.CompanyId).subscribe(data => {
    //   if (data && data.length) {
    //     this.shippings = data;
    //   } else {
    //     this.shippings = systemShippings;
    //   }
    // })
  }
}
