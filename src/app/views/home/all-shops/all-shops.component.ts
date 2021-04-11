import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from 'src/models/company.model';
import { CompanyService } from 'src/services/company.service';
import { HomeShopService } from 'src/services/home-shop.service';

@Component({
  selector: 'app-all-shops',
  templateUrl: './all-shops.component.html',
  styleUrls: ['./all-shops.component.scss']
})
export class AllShopsComponent implements OnInit {
  shops: Company[];
  showLoader: boolean = true;
  @Output() navAction: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private homeShopService: HomeShopService,


  ) { }

  ngOnInit() {
    this.getAllComapnies();
  }
  back() {
    // this.navAction.emit(true);
    this.router.navigate(['']);
  }
  getAllComapnies() {
    this.companyService.getSuperCompanies().subscribe(data => {
      this.showLoader = false;
      if (data && data.length) {
        this.shops = data.filter(x => Number(x.ProductsCount && x.ProductsCount.ProductsCount) > 0);
        console.log(this.shops );

      }

    })
  }

  view(item: Company) {
    if (item) {
      this.homeShopService.updatePageMovesIntroTrueFalse(true);
      this.router.navigate([item.Slug || item.CompanyId]);
    }

  }

}
