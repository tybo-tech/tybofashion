import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Email, Order, User, UserModel } from 'src/models';
import { ModalModel } from 'src/models/modal.model';
import { AccountService, EmailService, OrderService } from 'src/services';
import { UxService } from 'src/services/ux.service';
import { CUSTOMER, IMAGE_DONE } from 'src/shared/constants';
import { SocialAuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.scss']
})
export class SocialLoginComponent implements OnInit {

  show: boolean;
  order: Order;

  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Go shopping!',
    routeTo: '',
    img: undefined
  };
  @Input() userType: string;
  socialUser: SocialUser;
  loggedIn: boolean;
  modalImage: string;
  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private accountService: AccountService,
    private emailService: EmailService,
    private orderService: OrderService,
    private uxService: UxService,
    private authService: SocialAuthService
  ) { }

  ngOnInit() {
    this.order = this.orderService.currentOrderValue;
    this.authService.authState.subscribe((user) => {
      this.socialUser = user;
      this.loggedIn = (user != null);
      if (this.loggedIn) {
        const userModel: UserModel = {
          Dp: this.socialUser.photoUrl,
          Email:this.socialUser.email,
          CreateUserId:this.socialUser.provider,
          ModifyUserId: this.socialUser.provider,
          Name: this.socialUser.name,

          AddressUrlHome: '',
          AddressLineWork: '',
          AddressUrlWork: '',
          Surname: '',
   
          PhoneNumber: '',
          Password: `${Math.random() * 10}`,
          ImageUrl: '',
          UserType: this.userType || CUSTOMER,
          AccessType: '',
          AccessStatus: '',
          AccessStartDate: '',
          AccessEndDate: '',
          
          AddressLineHome: '',
          StatusId: 1,
          Roles: [],

        };
        this.modalImage = this.socialUser.photoUrl
        this.login(userModel);
      
      }
    });

  }


 
  login(model: UserModel) {
    this.uxService.showLoader();
    this.accountService.socialLogin(model).subscribe(user => {
      this.uxService.hideLoader();

      if (user && user.UserType === CUSTOMER) {
        this.accountService.updateUserState(user);

        if (this.order && this.order.CustomerId === 'checked') {
          this.order.CustomerId = user.UserId;
          this.order.Customer = user;
          this.orderService.updateOrderState(this.order);
          this.modalModel.routeTo = `shop/checkout`;
          this.modalModel.ctaLabel = `Go to checkout`;
        } else {
          this.modalModel.routeTo = ``;
        }
        this.modalModel.img = this.modalImage;
        this.modalModel.ctaLabel = `Go to shopping`;
        this.modalModel.body = [`Hi, ${model.Name}, welcome to Tybo Fashion.`];
        this.modalModel.heading = `Success!`

      }

    });
  }


  sendEmail(data: User) {
    const emailToSend: Email = {
      Email: data.Email,
      Subject: 'Tybo Fashion: Welcome & Activation',
      Message: '',
      Link: this.accountService.generateAccountActivationReturnLink(data.UserToken)
    };
    // this.showLoader = true;
    this.emailService.sendAccountActivationEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {

        }
      });
  }


  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }
}
