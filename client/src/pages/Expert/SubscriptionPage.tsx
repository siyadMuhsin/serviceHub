// SubscriptionPage.tsx

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
import {
  availbalePlans,
  purchaseSubscription,
  verifyPayment,
} from "@/services/Expert/expert.service";
import { useLocation } from "react-router-dom";
import { IExpert } from "@/Interfaces/interfaces";

// Stripe initialization
const stripePromise = loadStripe(
  'pk_test_51RAqATHKP9mRprZp3R6rRyvUmfJvagx1hUMJaQAUtggsWH1H0PsqQHijMbyFXWqr48Nw8jdo2uq4klWLhKFVxQEq00v89Ecv3g'
);

// Interfaces
interface Plan {
  _id: string;
  name: string;
  price: number;
  durationMonths: number;
  durationDisplay:string
  features?: string[];
}

interface VerifyResponse {
  success: boolean;
  paymentDetails?: any;
}

interface CheckoutFormProps {
  expert:IExpert
  plan: Plan;
  onBack: () => void;
  onSuccess: (details?: any) => void;
}

const SubscriptionPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
const location=useLocation()
const {expert}=location.state
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await availbalePlans();
      if (response.success && response.plans) {
        setPlans(response.plans);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan: Plan) => {
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
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Subscription Plans</h1>
        <p className="text-lg text-gray-600">
          Choose the plan that works best for you and increase your visibility to potential customers
        </p>
      </div>
        
      {/* Importance Notice */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-lg mb-10 transition-all duration-300 hover:shadow-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-blue-800">Profile Visibility Notice</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p className="mb-2">
                Your expert profile requires an active subscription to be visible to potential customers in our marketplace.
              </p>
              <p>
                Without a subscription, your profile will not appear in search results or recommendations, significantly reducing your opportunity to receive service requests.
              </p>
            </div>
          </div>
        </div>
      </div>
  
      {!selectedPlan ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((item) => (
            <div
              key={item._id}
              className="border rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 relative bg-white"
              onClick={() => handlePlanSelect(item)}
            >
              {/* Plan Name */}
              <h2 className="text-2xl font-bold text-gray-800 mb-3">{item.name}</h2>
  
              {/* Price */}
              <p className="text-3xl font-bold text-blue-600 mb-1">₹{item.price}</p>
              
              {/* Duration Display */}
              <p className="text-gray-600 mb-5">
                <span className="block text-sm">Duration:
                <strong className="text-lg">{item.durationDisplay}</strong></span>
              </p>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Select Plan
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 animate-slideUp">
          <button 
            onClick={handleBackToPlans}
            className="flex items-center text-blue-600 mb-4 hover:text-blue-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to plans
          </button>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirm Your Subscription</h2>
          
          <div className="mb-8 p-5 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-1">{selectedPlan.name}</h3>
            <p className="text-2xl font-bold text-blue-600 mb-2">₹{selectedPlan.price}</p>
            <p className="text-gray-600">
              <span className="font-medium">Duration:</span> {selectedPlan.durationMonths *30} days
            </p>
          </div>
  
          <Elements stripe={stripePromise}>
            <CheckoutForm
              expert={expert}
              plan={selectedPlan}
              onBack={handleBackToPlans}
              onSuccess={() =>
                navigate("/payment-success", { state: { plan: "premium" } })
              }
            />
          </Elements>
        </div>
      )}
    </div>
  );
};

const CheckoutForm: React.FC<CheckoutFormProps> = ({ expert,plan, onBack, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [paymentDetails, setPaymentDetails] = useState<any>();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) return;

    try {
      const { clientSecret } = await purchaseSubscription(plan._id);

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: expert.userId.name,
            },
          },
        });

      if (stripeError) {
        setError(stripeError.message || "Payment error");
        setProcessing(false);
        return;
      }

      const verification: VerifyResponse = await verifyPayment(
        paymentIntent.id,
        plan._id
      );

      if (verification.success) {
        setPaymentDetails(verification.paymentDetails);
        toast.success("Payment verified!");
        onSuccess(verification.paymentDetails);
      }

      toast.success("Subscription activated successfully!");
      onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Payment failed");
      toast.error("Payment failed. Please try again.");
    } finally {
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

      {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

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
