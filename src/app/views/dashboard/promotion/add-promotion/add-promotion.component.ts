import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/models';
import { Promotion } from 'src/models/promotion.model';
import { AccountService, UploadService } from 'src/services';
import { PromotionService } from 'src/services/promotion.service';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-add-promotion',
  templateUrl: './add-promotion.component.html',
  styleUrls: ['./add-promotion.component.scss']
})
export class AddPromotionComponent implements OnInit {

  promotion: Promotion;
  user: User;
  promotionId: string;
  constructor(
    private promotionService: PromotionService,
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private uploadService: UploadService,
    private uxService: UxService,



  ) {
    this.activatedRoute.params.subscribe(r => {
      this.promotionId = r.id;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (this.user && this.user.CompanyId &&  this.promotionId) {
      this.promotionService.get( this.promotionId).subscribe(data => {
        this.promotion = data;
      })
    }
  }
  back() {
    this.router.navigate(['admin/dashboard/promotions']);
  }

  savePromotion() {
    this.promotionService.update(this.promotion).subscribe(data => {
      if (data && data.PromotionId) {
        // this.back();
        this.uxService.updateMessagePopState('Promotion saved.')
      }

    })
  }

  public uploadFile = (files: FileList) => {
    if (files.length === 0) {
      return;
    }

    Array.from(files).forEach(file => {
      this.uploadService.resizeImage(file, null, null,null, this.promotion);
    });




  }

}
