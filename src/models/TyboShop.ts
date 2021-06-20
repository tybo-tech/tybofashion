import { Company } from "./company.model";
import { Product } from "./product.model";

export interface TyboShopModel {
  Picked?: Product[];
  Ladies?: Product[];
  Mens?: Product[];
  Campanies?: Company[];
  CurrentCompany?: Company;
}