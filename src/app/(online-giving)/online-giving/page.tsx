"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
// import Razorpay from "razorpay";
import { useState } from "react";

interface ResponseValue {
  razorpay_order_id: String;
  razorpay_payment_id: String;
  razorpay_signature: String;
}

function page() {
  const [amount, setAmount] = useState<Number>();
  console.log(process.env.NEXT_PUBLIC_RAZORPAY_API_KEY);
  const paymentHandler = async (e: any) => {
    const { data } = await axios.post("/api/v1/payment", {
      amount,
    });
    console.log(data);
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY!,
      amount: data.data.amount,
      currency: "INR",
      name: "Church website",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: data.data.id,
      handler: async function (response: ResponseValue) {
        const { data } = await axios.post("/api/v1/payment-verification", {
          ...response,
        });
        console.log(data);
      },
      prefill: {
        name: "Gaurav Kumar",
        email: "gaurav.kumar@example.com",
        contact: "9000090000",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    const razor = new window.Razorpay(options);
    razor.open();
    e.preventDefault();
  };
  return (
    <div>
      <h1>Thank You!</h1>
      <p>
        We greatly appreciate your contribution. Your support helps us to keep
        moving forward and achieve our goals.
      </p>
      <p>Thank you once again for your valuable input!</p>
      <Input
        placeholder="Amount"
        type="number"
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <Button size="lg" className="text-xl my-4" onClick={paymentHandler}>
        Contribute
      </Button>
    </div>
  );
}

export default page;
