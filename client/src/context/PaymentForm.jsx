import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function PaymentForm({ orderId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError('');

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      await API.post('/payment/confirm', { orderId });
      navigate('/orders');
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p className="text-red-600 mt-2">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="bg-gray-900 text-white px-4 py-2 rounded mt-4 disabled:opacity-50"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default PaymentForm;