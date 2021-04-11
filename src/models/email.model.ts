export interface EmailModel {
  fromEmail: string;
  alias?: string;
  toEmail: string;
  toName?: string;
  subject: string;
  message: string;
  fromEmailList?: string[];
  toEmailList?: string[];
}

export interface Email {
  Type?: string;
  Email: string;
  Subject: string;
  Message: string;
  Link?: string;
  UserFullName?: string;
  Name?: string;
  Amount?: number;
  AmountPaid?: number;
  AmountDue?: number;
  NextBillingDate?: string;
}
