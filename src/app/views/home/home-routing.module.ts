import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditMyProfileComponent } from 'src/app/account/edit-my-profile/edit-my-profile.component';
import { ForgotPasswordComponent, ResetPasswordComponent } from 'src/app/account/forgot-password';
import { ListMyOrdersComponent } from 'src/app/account/list-my-orders/list-my-orders.component';
import { MyProfileComponent } from 'src/app/account/my-profile/my-profile.component';
import { SignInComponent } from 'src/app/account/sign-in';
import { SocialLoginComponent } from 'src/app/account/sign-in/social-login/social-login.component';
import { SignUpComponent } from 'src/app/account/sign-up';
import { SignUpModalComponent } from 'src/app/account/sign-up-modal/sign-up-modal.component';
import { MyOrdersComponent } from '../dashboard/orders/my-orders/my-orders.component';
import { AllShopsComponent } from './all-shops/all-shops.component';
import { CartComponent, CheckoutComponent } from './cart';
import { CartItemsComponent } from './cart/cart-items/cart-items.component';
import { MyCartComponent } from './cart/my-cart/my-cart.component';
import { PaymentCancelledComponent } from './cart/payment-cancelled/payment-cancelled.component';
import { ShopingSuccesfulComponent } from './cart/shoping-succesful/shoping-succesful.component';
import { WishListComponent } from './cart/wish-list/wish-list.component';
import { ContactComponent } from './contact/contact.component';
import { CustomerFeedbackComponent } from './customer-feedback/customer-feedback.component';
import { FiitingRoomComponent } from './fiiting-room/fiiting-room.component';
import { HomeLandingComponent } from './home-landing';
import { CustomerDesignComponent } from './home-landing/customer-design/customer-design.component';
import { HelloPageComponent } from './home-landing/hello-page/hello-page.component';
import { HowItWorksComponent } from './home-landing/sell-with-us/how-it-works/how-it-works.component';
import { SellWithUsComponent } from './home-landing/sell-with-us/sell-with-us.component';
import { HomeLoaderComponent } from './home-loader/home-loader.component';
import { HomeNavComponent } from './home-nav';
import { HomeSideNavComponent } from './home-nav/home-side-nav/home-side-nav.component';
import { HomeToolbarNavigationComponent } from './home-toolbar-navigation/home-toolbar-navigation.component';
import { HomeComponent } from './home.component';
import { ProductSectionCardComponent, ProductSectionComponent, ProductSectionDetailComponent } from './product-section';
import { AllCollectionsComponent } from './product-section/collections/all-collections/all-collections.component';
import { CollectionsComponent } from './product-section/collections/collections.component';
import { OnSaleComponent } from './product-section/collections/on-sale/on-sale.component';
import { ShopCollectionComponent } from './product-section/collections/shop-collection/shop-collection.component';
import { ShopComponent } from './shop';
import { ShopNavComponent } from './shop-nav/shop-nav.component';
import { ShopSideNavComponent } from './shop-nav/shop-side-nav/shop-side-nav.component';
import { ShopProductsComponent } from './shop/shop-products/shop-products.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      // { path: '', component: SellWithUsComponent } , //     for admin only,
      { path: '', component: ProductSectionComponent },
      { path: ':id', component: ShopComponent },
      { path: 'home/shop', component: HomeLandingComponent },
      { path: 'home/sign-in', component: SignInComponent },
      { path: 'home/start-shop', component: SignUpModalComponent },
      { path: 'home/sign-up', component: SignUpComponent },
      { path: 'home/custom-design', component: CustomerDesignComponent },
      // { path: 'shop/checkout', component: ShopingSuccesfulComponent }    for testing only,
      { path: 'shop/checkout', component: CheckoutComponent },
      { path: 'shop/cart', component: MyCartComponent },
      { path: 'home/forgot-password', component: ForgotPasswordComponent },
      { path: 'home/reset-password', component: ResetPasswordComponent },
      { path: 'home/fitting-room', component: FiitingRoomComponent },
      { path: 'shop/product/:id', component: ProductSectionDetailComponent },
      { path: 'shop/collections/:id', component: ShopCollectionComponent },
      { path: 'home/collections/:id', component: CollectionsComponent },
      { path: 'home/all-collections/:id', component: AllCollectionsComponent },
      { path: 'home/hello-fashion-shop', component: SellWithUsComponent },
      { path: 'home/shops', component: AllShopsComponent },
      { path: 'home/contact-us', component: ContactComponent },
      { path: 'home/payment-cancelled/:id', component: PaymentCancelledComponent },
      // { path: 'home/payment-cancelled/:id', component: ShopingSuccesfulComponent }     for testing only,
      { path: 'home/shopping-succesful/:id', component: ShopingSuccesfulComponent },
      { path: 'home/profile', component: MyProfileComponent },
      { path: 'home/edit-myprofile', component: EditMyProfileComponent },
      { path: 'home/my-orders', component: ListMyOrdersComponent },
      { path: 'home/on-sale', component: OnSaleComponent },
      { path: 'home/wishlist', component: WishListComponent },
    ]
    
    // { path: '', component: FiitingRoomComponent },
  }
];

export const declarations = [
  SignInComponent,
  SignUpComponent,
  ForgotPasswordComponent,
  ResetPasswordComponent,
  HomeComponent,
  HomeLandingComponent,
  HomeNavComponent,
  ShopComponent,
  ProductSectionComponent,
  ProductSectionDetailComponent,
  FiitingRoomComponent,
  ProductSectionCardComponent,
  HomeToolbarNavigationComponent,
  CartComponent,
  CheckoutComponent,
  CollectionsComponent,
  SellWithUsComponent,
  SignUpModalComponent,
  HowItWorksComponent,
  AllShopsComponent,
  ContactComponent,
  ShopingSuccesfulComponent,
  PaymentCancelledComponent,
  CartItemsComponent,
  CustomerFeedbackComponent,
  HomeLoaderComponent,
  MyProfileComponent,
  EditMyProfileComponent,
  MyOrdersComponent,
  ListMyOrdersComponent,
  HomeSideNavComponent,
  ShopSideNavComponent,
  ShopNavComponent,
  ShopProductsComponent,
  ShopCollectionComponent,
  MyCartComponent,
  HelloPageComponent,
  CustomerDesignComponent,
  OnSaleComponent,
  SocialLoginComponent,
  AllCollectionsComponent,
  WishListComponent
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
