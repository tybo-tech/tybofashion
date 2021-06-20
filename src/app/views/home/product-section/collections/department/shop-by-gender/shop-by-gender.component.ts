import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/models';

@Component({
  selector: 'app-shop-by-gender',
  templateUrl: './shop-by-gender.component.html',
  styleUrls: ['./shop-by-gender.component.scss']
})
export class ShopByGenderComponent implements OnInit {

  @Input() products;
  @Input() label;
  selectedProduct: Product;

  constructor(private router: Router) { }

  ngOnInit() {

  }
  viewMore(model: Product) {
    if (model) {
      this.selectedProduct = model;
      return
    }
  }
  gotoComapny(product: Product) {
    window.scroll(0, 0);
    if (product.Company) {
      this.router.navigate([product.Company.Slug || product.CompanyId]);
      return;
    }
    this.router.navigate([product.CompanyId]);
  }

}
