const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-08-16' });

// NOTE: this file exports a function to be mounted with raw body handling
// We'll create a small express app instance here to use express.raw()
const paymentsApp = express();

// Stripe webhook expects raw body for signature verification
paymentsApp.use(
  express.raw({ type: 'application/json' })
);

paymentsApp.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // If you don't have a webhook secret, parse safely (development only)
      event = req.body;
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('✅ Pago completado para session:', session.id);
      // Aquí podrías marcar orden como pagada en DB
      break;
    case 'payment_intent.succeeded':
      console.log('PaymentIntent succeeded:', event.data.object.id);
      break;
    default:
      console.log(`Evento no manejado: ${event.type}`);
  }

  res.json({ received: true });
});

// Export the mini app as middleware (so server.js can mount it)
module.exports = paymentsApp;
