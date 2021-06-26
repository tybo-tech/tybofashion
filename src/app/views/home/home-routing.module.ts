import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditMyProfileComponent } from 'src/app/account/edit-my-profile/edit-my-profile.component';
import { ForgotPasswordComponent, ResetPasswordComponent } from 'src/app/account/forgot-password';
import { ListMyOrdersComponent } from 'src/app/account/list-my-orders/list-my-orders.component';
import { MyProfileComponent } from 'src/app/account/my-profile/my-profile.component';
import { InviteComponent } from 'src/app/account/my-refferals/invite/invite.component';
import { MyRefferalsComponent } from 'src/app/account/my-refferals/my-refferals.component';
import { SignInComponent } from 'src/app/account/sign-in';
import { QuickSignInComponent } from 'src/app/account/sign-in/quick-sign-in/quick-sign-in.component';
import { SocialLoginComponent } from 'src/app/account/sign-in/social-login/social-login.component';
import { SignUpComponent } from 'src/app/account/sign-up';
import { SignUpModalComponent } from 'src/app/account/sign-up-modal/sign-up-modal.component';
import { PromotionTextPipe } from 'src/app/_pipes/promotionText.pipe';
import { SearchCompanyPipe } from 'src/app/_pipes/search-company.pipe';
import { SearchProductHomePipe } from 'src/app/_pipes/search-product-home.pipe';
import { TextarealinebreakpipePipe } from 'src/app/_pipes/textarealinebreakpipe.pipe';
import { MyOrdersComponent } from '../dashboard/orders/my-orders/my-orders.component';
import { ViewMyOrderComponent } from '../dashboard/orders/view-order/view-my-order/view-my-order.component';
import { ViewOrderComponent } from '../dashboard/orders/view-order/view-order.component';
import { AllShopsComponent } from './all-shops/all-shops.component';
import { ListShopsComponent } from './all-shops/list-shops/list-shops.component';
import { CartComponent, CheckoutComponent } from './cart';
import { CartItemsComponent } from './cart/cart-items/cart-items.component';
import { MyCartComponent } from './cart/my-cart/my-cart.component';
import { PaymentCancelledComponent } from './cart/payment-cancelled/payment-cancelled.component';
import { ShopingSuccesfulComponent } from './cart/shoping-succesful/shoping-succesful.component';
import { WishListComponent } from './cart/wish-list/wish-list.component';
import { CustomerFeedbackComponent } from './customer-feedback/customer-feedback.component';
import { FiitingRoomComponent } from './fiiting-room/fiiting-room.component';
import { AboutComponent } from './general/about/about.component';
import { ButtinSpinnerComponent } from './general/buttin-spinner/buttin-spinner.component';
import { ContactComponent } from './general/contact/contact.component';
import { FloatingMenuComponent } from './general/floating-menu/floating-menu.component';
import { FooterComponent } from './general/footer/footer.component';
import { ReturnsPolicyComponent } from './general/returns-policy/returns-policy.component';
import { SearchShopComponent } from './general/search-shop/search-shop.component';
import { TermsComponent } from './general/terms/terms.component';
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
import { BreadComponent } from './product-section/collections/bread/bread.component';
import { ChatComponent } from './product-section/collections/chat/chat.component';
import { MessagesComponent } from './product-section/collections/chat/messages/messages.component';
import { CollectionsComponent } from './product-section/collections/collections.component';
import { DepartmentComponent } from './product-section/collections/department/department.component';
import { FeaturedComponent } from './product-section/collections/department/featured/featured.component';
import { ShopByGenderComponent } from './product-section/collections/department/shop-by-gender/shop-by-gender.component';
import { OnSaleComponent } from './product-section/collections/on-sale/on-sale.component';
import { ShopCollectionComponent } from './product-section/collections/shop-collection/shop-collection.component';
import { ProductQuickViewComponent } from './product-section/product-section-detail/product-quick-view/product-quick-view.component';
import { ProductSliderComponent } from './product-section/product-section-detail/product-slider/product-slider.component';
import { ShopByCatergoryComponent } from './product-section/product-section-detail/shop-by-catergory/shop-by-catergory.component';
import { ShopComponent } from './shop';
import { ShopNavComponent } from './shop-nav/shop-nav.component';
import { ShopSideNavComponent } from './shop-nav/shop-side-nav/shop-side-nav.component';
import { SetUpShopComponent } from './shop/shop-products/set-up-shop/set-up-shop.component';
import { ShopProductsComponent } from './shop/shop-products/shop-products.component';
import { ShowPromotionsComponent } from './shop/shop-products/show-promotions/show-promotions.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      // { path: '', component: SellWithUsComponent } , //     for admin only,
      { path: '', component: ProductSectionComponent },
      // { path: ':id', component: ShopComponent },
      { path: ':id', component: ShopProductsComponent },
      // { path: 'home/shop', component: HomeLandingComponent },
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
      { path: 'home/shops', component: ListShopsComponent },
      { path: 'home/payment-cancelled/:id', component: PaymentCancelledComponent },
      // { path: 'home/payment-cancelled/:id', component: ShopingSuccesfulComponent },  //    for testing only,
      { path: 'home/shopping-succesful/:id', component: ShopingSuccesfulComponent },
      { path: 'home/profile', component: MyProfileComponent },
      { path: 'home/edit-myprofile', component: EditMyProfileComponent },
      { path: 'home/my-orders', component: ListMyOrdersComponent },
      { path: 'home/on-sale', component: OnSaleComponent },
      { path: 'home/wishlist', component: WishListComponent },
      { path: 'private/order-details/:id', component: ViewOrderComponent },
      { path: 'home/view-my-order/:id', component: ViewMyOrderComponent },
      { path: 'home/shop-for/:id', component: DepartmentComponent },
      { path: 'home/chat/:id/:userId/:userToId', component: ChatComponent },
      { path: 'home/messages/:traceId/:targetId', component: MessagesComponent },
      
      //general
      
      { path: 'home/contact-us', component: ContactComponent },
      { path: 'home/about', component: AboutComponent },
      { path: 'home/terms', component: TermsComponent },
      { path: 'home/returns-policy', component: ReturnsPolicyComponent },
      { path: 'home/how-it-works', component: HowItWorksComponent },
      { path: 'home/search', component: SearchShopComponent },
      { path: 'home/my-refferals', component: MyRefferalsComponent },
      { path: 'home/invite/:id', component: InviteComponent },
      

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
  WishListComponent,
  ViewOrderComponent,
  ViewMyOrderComponent,
  DepartmentComponent,
  BreadComponent,
  ChatComponent,
  MessagesComponent,
  TextarealinebreakpipePipe,
  ProductSliderComponent,
  ShowPromotionsComponent,
  PromotionTextPipe,
  SearchCompanyPipe,
  SearchProductHomePipe,
  ShopByCatergoryComponent,
  ProductQuickViewComponent,
  ReturnsPolicyComponent,
  AboutComponent,
  TermsComponent,
  FooterComponent,
  FeaturedComponent,
  ShopByGenderComponent,
  QuickSignInComponent,
  ButtinSpinnerComponent,
  FloatingMenuComponent,
  SearchShopComponent,
  MyRefferalsComponent,
  InviteComponent,
  ListShopsComponent,
  SetUpShopComponent
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
