export interface Interaction {
  InteractionId: string;
  InteractionType: string;
  InteractionSourceId: string;
  InteractionTargetId: string;
  TraceId: string;
  InteractionBody: string;
  InteractionStatus: string;
  ImageUrl: string;
  CreateUserId: string;
  ModifyUserId: string;
  CreateDate?: string;
  ModifyDate?: string;
  StatusId: number;

}



export interface InteractionSearchModel {
  InteractionSourceId: string;
  InteractionTargetId: string;
  StatusId: number;

}
