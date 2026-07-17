const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/order');

// @route POST /api/payment/create-payment-intent
const createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Stripe amount must be in cents/smallest currency unit
    const amount = Math.round(order.totalPrice * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'inr',
      metadata: { orderId: order._id.toString() },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/payment/confirm
const confirmPayment = async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ message: 'Payment Intent ID is required' });
    }

    // Retrieve PaymentIntent from Stripe server-side to prevent client fraud
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      order.isPaid = true;
      order.paidAt = Date.now();
      await order.save();

      res.status(200).json({ message: 'Payment confirmed successfully', order });
    } else {
      res.status(400).json({ message: `Payment failed with status: ${paymentIntent.status}` });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
};
