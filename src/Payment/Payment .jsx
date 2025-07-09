import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import CheckOutFrom from './CheckOutFrom';

const stripepromise = loadStripe(import.meta.env.VITE_PAYMENT_KEY);

const Payment  = () => {
    return (
      <Elements stripe={stripepromise}>
      <CheckOutFrom></CheckOutFrom>
      </Elements>
    );
};

export default Payment ;