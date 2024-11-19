import React, { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./CheckoutForm.css";

const CheckoutForm = ({ clientSecret, onPurchaseSuccess, bookDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      alert("Payment successful!");

      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/purchase/${id}/confirm`,
        { price: bookDetails.price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Call the callback function to update the parent state
      onPurchaseSuccess();
      setLoading(false);
      navigate(`/books/${id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="payment-summary">
        <h4>Payment Details</h4>
        <p>
          <strong>Book:</strong> {bookDetails.name}
        </p>
        <p>
          <strong>Price:</strong> ${bookDetails.price}
        </p>
      </div>


      <CardElement className="card-element" />

      {error && <div className="error-msg">{error}</div>}

      <button type="submit" disabled={loading} className="btn pay-btn">
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default CheckoutForm;
