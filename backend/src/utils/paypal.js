let baseUrl = "https://api-m.sandbox.paypal.com";
const base64 = require("base-64");
let clientId =
  "AW9ZnpX4s04lvYC8dPO-7NP-64tfaSOfV3wppB2KMdwiO0Zz1PuzYR3Fi9vIMoZU9DCVgJYvyUeX_302";

let secret =
  "EEKQDrd7crmShygqCXjvP-8np19GZTS25a6nXFL2-G1OaN9ZpCefapEanSzIuAsIzaJns8d0YORB1InO";

export const generateTokenToken = async () => {
  const auth = base64.encode(`${clientId}:${secret}`);
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await response.json();
  if (response.ok) {
    return data.access_token;
  } else {
    throw new Error(`Error: ${data.error_description}`);
  }
};

export const createOrder = async (amount) => {
  const token = await generateTokenToken();
  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount,
          },
        },
      ],
    }),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(`Error: ${data.message}`);
  }
};
export const captureOrder = async (orderId) => {
  const token = await generateTokenToken();
  const response = await fetch(
    `${baseUrl}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(`Error: ${data.message}`);
  }
};
export const getOrderDetails = async (orderId) => {
  const token = await generateTokenToken();
  const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(`Error: ${data.message}`);
  }
};
export const refundOrder = async (captureId) => {
  const token = await generateTokenToken();
  const response = await fetch(
    `${baseUrl}/v2/payments/captures/${captureId}/refund`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(`Error: ${data.message}`);
  }
};

export const getTransactionDetails = async (transactionId) => {
  const token = await generateTokenToken();
  const response = await fetch(
    `${baseUrl}/v1/reporting/transactions/${transactionId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(`Error: ${data.message}`);
  }
};

export const getTransactionHistory = async (startDate, endDate) => {
  const token = await generateTokenToken();
  const response = await fetch(
    `${baseUrl}/v1/reporting/transactions?start_date=${startDate}&end_date=${endDate}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(`Error: ${data.message}`);
  }
};
export const getTransactionDetailsById = async (transactionId) => {
  const token = await generateTokenToken();
  const response = await fetch(
    `${baseUrl}/v1/reporting/transactions/${transactionId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(`Error: ${data.message}`);
  }
};
