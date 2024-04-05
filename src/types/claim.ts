export enum ClaimStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  FINALIZED = "FINALIZED",
}

export type TClaimStatus = keyof typeof ClaimStatus;

export type TClaimCurrency = "SGG" | "VND" | "USD";

export type TClaim = {
  children?: TClaim[];
  isDuplicated: boolean;
  claim_id: string;
  org_id: string;
  staff_id: string;
  receipt_language: string;
  receipt_address: string;
  receipt_unique_id: string;
  receipt_datetime_of_purchase: string | Date;
  receipt_merchant_name: string;
  receipt_ccy: TClaimCurrency;
  receipt_total_amount: number;
  receipt_items: null;
  receipt_taxes: number;
  receipt_img_url: string;
  claim_description: string;
  receipt_payment_method: string;
  claim_category: string;
  claim_account: string;
  claim_state: TClaimStatus;
  receipt_country: string;
  initial_pred: null;
  ocr_text: null;
  flagged?: null;
  updatedAt: string;
  createdAt: string;
};
