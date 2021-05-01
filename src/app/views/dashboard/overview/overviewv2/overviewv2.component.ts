import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, User } from 'src/models';
import { ProductService, AccountService, CompanyCategoryService } from 'src/services';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-overviewv2',
  templateUrl: './overviewv2.component.html',
  styleUrls: ['./overviewv2.component.scss']
})
export class Overviewv2Component implements OnInit {
  products: Product[];
  allProducts: Product[];
  user: User;
  showAdd:boolean;
  constructor(
    private productService: ProductService,
    private accountService: AccountService,
    private companyCategoryService: CompanyCategoryService,
    private router: Router,
    private uxService: UxService,
    ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.uxService.updateLoadingState({ Loading: true, Message: 'Loading products, please wait.' })
    this.productService.getProductsSync(this.user.CompanyId).subscribe(data => {
      this.products = data;
      console.log(this.products);

      this.allProducts = data;

      this.uxService.updateLoadingState({ Loading: false, Message: undefined });
    })
    // this.loadCategories();
  }
  loadCategories() {
    throw new Error('Method not implemented.');
  }
  goto(url) {
    this.router.navigate([`admin/dashboard/${url}`]);
  }

  view(product: Product) {
    this.productService.updateProductState(product);
    this.router.navigate(['admin/dashboard/product', product.ProductSlug || product.ProductId]);
  }
}
