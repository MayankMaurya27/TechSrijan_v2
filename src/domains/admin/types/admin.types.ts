export interface RegistrantRow {
  id: string;
  name: string;
  email: string;
  college: string;
  event: string;
  amount: string;
  orderId: string;
  status: "confirmed" | "pending_manual_review" | "failed";
  timestamp: string;
}
