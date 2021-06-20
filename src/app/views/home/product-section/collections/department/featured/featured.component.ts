import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/models/product.model';

@Component({
  selector: 'app-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.scss']
})
export class FeaturedComponent implements OnInit {

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
