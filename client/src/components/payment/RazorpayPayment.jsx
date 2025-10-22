import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CustomButton from "../ui/CustomButton";
import { toast } from "react-hot-toast";
import { paymentApi } from "../../api/PaymentApi";
import { orderApi } from "../../api/orderApi";

const RazorpayPayment = ({ totalPrice, id, payOrder }) => {

  // ✅ Optional debug hook: useEffect is now in the correct place
  useEffect(() => {
    console.log("RazorpayPayment component mounted...");
  }, []);

  // ✅ Normal JS function, no hooks inside
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const [isProcessing, setIsProcessing] = useState(false);

const handleRazorpayPayment = async () => {
  if (isProcessing) return; // prevent double-clicks
  setIsProcessing(true);

  try {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load.");
      setIsProcessing(false);
      return;
    }

    const orderData = await paymentApi.createRazorpayOrder(totalPrice);

    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "OLDSCHOOLHERITAGE",
      description: "Order Payment",
      order_id: orderData.id,
      handler: async function (response) {
        try {
          const verifyBody = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: id,
          };

          const verifyRes = await paymentApi.verifyRazorpayPayment(verifyBody);

          if (verifyRes.verified) {
            await orderApi.PayOrder(id, {
              paymentResult: {
                id: response.razorpay_payment_id,
                status: "succeeded",
                type: "Razorpay",
              },
            });
            toast.success("Payment successful & stock updated!");
            setTimeout(() => window.location.reload(), 1000);
          } else {
            toast.error(verifyRes.message || "Payment verification failed!");
          }
        } catch (err) {
          console.error(err);
          toast.error(err?.message || "Error completing payment");
        }
      },
      prefill: { name: "Customer", email: "customer@example.com" },
      theme: { color: "#3399cc" },
    };

    const razor = new window.Razorpay(options);
    razor.open();
    razor.on("payment.failed", (response) => {
      toast.error(response.error.description);
    });
  } catch (error) {
    console.error("Error initiating payment:", error);
    toast.error("Error initiating payment");
  } finally {
    setIsProcessing(false); // reset flag after attempt
  }
};


  return (
    <CustomButton
  onClick={handleRazorpayPayment}
  size="large"
  fullWidth
  color="primary"
>
  {isProcessing ? "Processing..." : "Pay with Razorpay"}
</CustomButton>

  );
};

RazorpayPayment.propTypes = {
  totalPrice: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  payOrder: PropTypes.func.isRequired,
};

export default RazorpayPayment;
