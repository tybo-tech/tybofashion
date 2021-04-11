import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Email, Order, Orderproduct, Product, User } from 'src/models';
import { AccountService, EmailService, OrderService, ProductService, UserService } from 'src/services';
import { CustomerService } from 'src/services/customer.service';
import { UxService } from 'src/services/ux.service';
import { ADMIN, NOTIFY_EMAILS } from 'src/shared/constants';


@Component({
  selector: 'app-shoping-succesful',
  templateUrl: './shoping-succesful.component.html',
  styleUrls: ['./shoping-succesful.component.scss']
})
export class ShopingSuccesfulComponent implements OnInit {
  order: Order;
  showDone: boolean;
  orderNo: string;
  user: User;
  products: Product[];

  constructor(
    private orderService: OrderService,
    private router: Router,
    private emailService: EmailService,
    private userService: UserService,
    private customerService: CustomerService,
    private accountService: AccountService,
    private productService: ProductService,
    private uxService: UxService,

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.order = this.orderService.currentOrderValue;

    if (this.order) {
      this.uxService.showLoader();
      this.order.Status = 'Processing';
      this.order.Paid = this.order.Total;
      this.order.Due = 0;

      this.productService.getProductsSync(this.order.CompanyId).subscribe(products => {
        this.products = products
      });
      if (this.order.Company && !this.order.Company.Email) {
        this.userService.getUsersStync(this.order.CompanyId, ADMIN).subscribe(users => {
          if (users && users.length) {
            this.order.Company.Email = users[0].Email;
            this.getOrders();
          }
        })
      } else {
        this.getOrders();
      }

    }
  }

  getOrders() {
    this.orderService.getOrdersSync(this.order.CompanyId).subscribe(data => {

      if (data) {
        this.order.OrderNo = `INV00${data.length + 1}`;
        this.orderService.updateOrderState(this.order);
        this.checkCustomerProfileForCompany();
      } else {
        this.order.OrderNo = `INV001`;
        this.orderService.updateOrderState(this.order);
        this.checkCustomerProfileForCompany();
      }

    })
  }

  checkCustomerProfileForCompany() {
    this.customerService.getCustomerByEmailandCompanyIdSync(this.user.Email, this.order.CompanyId).subscribe(data => {
      if (data && data.CustomerId) {
        this.order.CustomerId = data.CustomerId;
        this.saveInvoice();
      } else {
        const newCustomerProfile = {
          CustomerId: '',
          CompanyId: this.order.CompanyId,
          CustomerType: 'Customer',
          Name: this.user.Name,
          Surname: this.user.Surname,
          Email: this.user.Email,
          PhoneNumber: this.user.PhoneNumber,
          Password: '',
          Dp: this.user.Dp,
          AddressLineHome: this.user.AddressLineHome,
          AddressUrlHome: this.user.AddressUrlHome,
          AddressLineWork: this.user.AddressLineWork,
          AddressUrlWork: this.user.AddressUrlWork,
          CreateUserId: this.user.UserId,
          ModifyUserId: this.user.UserId,
          StatusId: '1',
          UserToken: ''
        };
        this.customerService.add(newCustomerProfile).subscribe(newCust => {
          if (newCust && newCust.CustomerId) {
            this.order.CustomerId = newCust.CustomerId;
            this.saveInvoice();
          }
        });
      }
    });
  }
  saveInvoice() {
    if (!this.order.Shipping) {
      this.order.Shipping = '';
    }
    if (!this.order.ShippingPrice) {
      this.order.ShippingPrice = 0;
    }

    this.orderService.create(this.order).subscribe(data => {
      if (data && data.OrdersId) {
      this.uxService.hideLoader();

        this.productService.adjustStockAfterSale(this.products, this.order);
        const body = `Congratulations you have received an order of R${this.order.Total}`;
        const customerEMail = `  Your order, is being processed.
                        Once your order is ready to be delivered, you'll receive 
                        an Email notification confirming your scheduled delivery
                         date.`;
        const company = this.order.Company;
        if (company && company.Email) {
          this.sendEmailLogToShop(body, company.Name || '', company.Email);
          // this.sendEmailLogToShop(customerEMail, this.order.Customer.Name || '', this.order.Customer.Email);
          this.sendEmailLogToShop(body, company.Name || '', NOTIFY_EMAILS);
        }
        this.order = data;
        this.showDone = true;
        this.orderNo = this.order.OrderNo;
        console.log(data);

        this.orderService.updateOrderState(null);
      }
    });

  }


  back() {
    this.router.navigate(['']);
  }
  track() {
    this.router.navigate(['home/my-orders']);
  }
  sendEmailLogToShop(data, companyName: string, email: string) {
    const emailToSend: Email = {
      Email: email,
      Subject: 'New order placed & paid',
      Message: `${data}`,
      UserFullName: companyName,
      Link: `${environment.BASE_URL_ADMIN}`
    };
    this.emailService.sendGeneralTextEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {

        }
      });
  }

}
