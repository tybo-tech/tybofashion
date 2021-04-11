import { Company } from "./company.model";

export interface Promotion {
  PromotionId: string;
  Name: string;
  CompanyId: string;
  PromoCode: string;
  PromoType: string;
  DiscountValue: string;
  DiscountUnits: string;
  AppliesTo: string;
  MinimumRequirements: string;
  MinimumRequirementValue: string;
  StartDate: string;
  FinishDate: string;
  StartTime: string;
  FinishTime: string;
  ImageUrl: string;
  CreateUserId: string;
  ModifyUserId: string;
  StatusId: number;
  Class?: string[];
  Company?: Company;
}