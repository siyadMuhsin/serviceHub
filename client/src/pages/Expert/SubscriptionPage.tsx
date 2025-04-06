import { availbalePlans, purchaseSubscription, verifyPayment } from "@/services/Expert/expert.service";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { useNavigate } from "react-router-dom";

// Initialize Stripe
const stripePromise = loadStripe( 'pk_test_51RAqATHKP9mRprZp3R6rRyvUmfJvagx1hUMJaQAUtggsWH1H0PsqQHijMbyFXWqr48Nw8jdo2uq4klWLhKFVxQEq00v89Ecv3g');

const SubscriptionPage = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

const navigate=useNavigate()
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await availbalePlans();
      if (response.success) {
        setPlans(response.plans);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleBackToPlans = () => {
    setSelectedPlan(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Subscription Plans</h1>
      
      {!selectedPlan ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((item) => (
            <div
              key={item._id}
              className="border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handlePlanSelect(item)}
            >
              <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
              <p className="text-2xl font-bold text-blue-600 mb-4">₹{item.price}</p>
              <p className="text-gray-600 mb-4">
                Duration: {item.duration} days
              </p>
              <div className="mb-4">
                {item.features?.map((feature, index) => (
                  <p key={index} className="flex items-center mb-2">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    {feature}
                  </p>
                ))}
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                Select Plan
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Confirm Your Subscription</h2>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold">{selectedPlan.name}</h3>
            <p className="text-xl font-bold text-blue-600">₹{selectedPlan.price}</p>
            <p className="text-gray-600">
              Duration: {selectedPlan.duration} days
            </p>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm 
              plan={selectedPlan} 
              onBack={handleBackToPlans}
              onSuccess={() =>  navigate('/payment-success', { state: { plan: 'premium' } })}
            />
          </Elements>
        </div>
      )}
    </div>
  );
};

const CheckoutForm = ({ plan, onBack, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
const [paymentDetails,setPaymentDetails]=useState()
  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    try {
      // Create payment intent
      const {  clientSecret } = await purchaseSubscription(plan._id);

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret ,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: "Expert Name", // You might want to fetch this from user data
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      const verification = await verifyPayment(paymentIntent.id,plan._id);
      
      if (verification.success) {
        setPaymentDetails(verification.paymentDetails);
        toast.success("Payment verified!");
        onSuccess(verification.paymentDetails); // Pass details to success handler
      }
      // Payment succeeded
      toast.success("Subscription activated successfully!");
      
      onSuccess();
    } catch (err) {
        console.log(err)
      setError(err.response?.data?.message || "Payment failed");
      toast.error("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Card Details</label>
        <div className="border rounded-lg p-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 mb-4 text-sm">{error}</div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
          disabled={processing}
        >
          Back
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          disabled={!stripe || processing}
        >
          {processing ? "Processing..." : `Pay ₹${plan.price}`}
        </button>
      </div>
    </form>
  );
};

export default SubscriptionPage;