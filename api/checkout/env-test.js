export default function handler(req, res) {
  res.status(200).json({
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || null,
    PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET ? "OK" : null
  });
}
