export type MomoPaymentRequest = {
  phone_number: string
  amount: string
}

export type MomoPaymentResponse = {
  message?: string
  reference_id?: string
  status?: number
}

export type MomoStatusResponse = {
  status: "SUCCESSFUL" | "FAILED" | "PENDING";
};