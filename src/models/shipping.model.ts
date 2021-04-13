export interface Shipping {
  ShippingId: string;
  CompanyId: string;
  Name: string;
  Description: string;
  Price: number;
  ImageUrl: string;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  StatusId: number;
  Selected?: boolean;
}


export const systemShippings: Shipping[] = [
  // {
  //   ShippingId: '',
  //   CompanyId: '',
  //   Name: 'Collect',
  //   Description: '',
  //   Price: 0,
  //   ImageUrl: '',
  //   CreateUserId: undefined,
  //   ModifyUserId: undefined,
  //   StatusId: 1

  // },
  {
    ShippingId: 'courier',
    CompanyId: '',
    Name: 'Courier',
    Description: '',
    Price: 100,
    ImageUrl: '',
    CreateUserId: undefined,
    ModifyUserId: undefined,
    StatusId: 1
  },
  {
    ShippingId: '',
    CompanyId: '',
    Name: 'Paxi,7 to 9 days',
    Description: '',
    Price: 59.95,
    ImageUrl: '',
    CreateUserId: undefined,
    ModifyUserId: undefined,
    StatusId: 1

  },
  {
    ShippingId: '',
    CompanyId: '',
    Name: 'Paxi,3 to 5 days',
    Description: '',
    Price: 100,
    ImageUrl: '',
    CreateUserId: undefined,
    ModifyUserId: undefined,
    StatusId: 1

  },

]