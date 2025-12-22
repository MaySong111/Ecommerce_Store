import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const submit = async (e) => {
    e.preventDefault();
    
    await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: "http://localhost:5173/checkout/success" },
    });
  };

  return (
    <form onSubmit={submit}>
      <PaymentElement />
      <button>Pay</button>
    </form>
  );
}
