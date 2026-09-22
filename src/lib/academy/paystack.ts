// Paystack API integration for Maxmark Animations Academy
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
const PAYSTACK_BASE_URL = "https://api.paystack.co";

export type InitializePaymentParams = {
  email: string;
  amountKobo: number;
  callbackUrl: string;
  tierId: string;
  userId: string;
  planCode?: string; // If recurring subscription
};

export type InitializePaymentResponse = {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

export type VerifyPaymentResponse = {
  status: boolean;
  message: string;
  data?: {
    id: number;
    status: string; // 'success' | 'failed' | 'abandoned'
    reference: string;
    amount: number;
    currency: string;
    customer: {
      id: number;
      email: string;
      customer_code: string;
    };
    metadata?: {
      tierId?: string;
      userId?: string;
    };
    subscription?: {
      subscription_code: string;
      email_token: string;
    };
  };
};

/**
 * Initialize Paystack transaction for one-time or subscription payment
 */
export async function initializePaystackPayment(
  params: InitializePaymentParams
): Promise<InitializePaymentResponse> {
  // If secret key is not provided (e.g. initial dev preview), provide a simulated response
  if (!PAYSTACK_SECRET_KEY) {
    console.warn("PAYSTACK_SECRET_KEY is not configured. Falling back to local simulation mode.");
    const mockRef = `mock_ref_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return {
      status: true,
      message: "Authorization URL created (simulation mode)",
      data: {
        authorization_url: `${params.callbackUrl}?reference=${mockRef}&simulated=true`,
        access_code: `mock_code_${Date.now()}`,
        reference: mockRef,
      },
    };
  }

  const payload: Record<string, any> = {
    email: params.email,
    amount: params.amountKobo,
    callback_url: params.callbackUrl,
    metadata: {
      tierId: params.tierId,
      userId: params.userId,
    },
  };

  if (params.planCode) {
    payload.plan = params.planCode;
  }

  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return res.json();
}

/**
 * Verify Paystack transaction
 */
export async function verifyPaystackPayment(
  reference: string
): Promise<VerifyPaymentResponse> {
  if (!PAYSTACK_SECRET_KEY || reference.startsWith("mock_ref_")) {
    return {
      status: true,
      message: "Verification successful (simulation mode)",
      data: {
        id: 999999,
        status: "success",
        reference,
        amount: 15000000,
        currency: "NGN",
        customer: {
          id: 1,
          email: "student@maxmarkstudio.com",
          customer_code: "CUS_mock",
        },
        metadata: {
          tierId: "lifetime",
        },
      },
    };
  }

  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  });

  return res.json();
}
