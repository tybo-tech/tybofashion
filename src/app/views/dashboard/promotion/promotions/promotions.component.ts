import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { Promotion } from 'src/models/promotion.model';
import { AccountService } from 'src/services';
import { PromotionService } from 'src/services/promotion.service';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss']
})
export class PromotionsComponent implements OnInit {
  promotions: Promotion[] = [];
  scheduledPromotions: Promotion[];
  inactivePromotions: Promotion[];
  showAdd: boolean;
  newPromotion: Promotion;
  user: User;
  constructor(
    private promotionService: PromotionService,
    private accountService: AccountService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (this.user && this.user.CompanyId) {
      this.promotionService.getByCompanyId(this.user.CompanyId, 1).subscribe(data => {
        this.promotions = data || [];
      })
      this.promotionService.getByCompanyId(this.user.CompanyId, 2).subscribe(data => {
        this.scheduledPromotions = data || [];
      })
      this.promotionService.getByCompanyId(this.user.CompanyId, 3).subscribe(data => {
        this.inactivePromotions = data || [];
      })
    }
  }
  view(promotion: Promotion) {
    this.router.navigate(['admin/dashboard/promotion', promotion.PromotionId]);
  }
  add() {
    this.newPromotion = {
      PromotionId: '',
      Name: `Promotion ${this.promotions.length + 1}`,
      CompanyId: this.user.CompanyId,
      PromoCode: '',
      PromoType: 'Percentage off',
      DiscountValue: '0',
      DiscountUnits: '',
      AppliesTo: 'All products',
      MinimumRequirements: 'None',
      MinimumRequirementValue: '',
      StartDate: '',
      FinishDate: '',
      StartTime: '',
      FinishTime: '',
      ImageUrl: '',
      CreateUserId: this.user.CompanyId,
      ModifyUserId: this.user.CompanyId,
      StatusId: 1,
    }
    this.showAdd = true
  }
  back() { 
    this.router.navigate(['admin/dashboard']);
  }
  savePromotion() {
    this.promotionService.add(this.newPromotion).subscribe(data => {
      if (data && data.PromotionId) {
        this.view(data);
      }

    })
  }
}
