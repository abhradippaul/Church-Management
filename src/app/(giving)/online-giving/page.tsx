"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnlineGivingContext } from "@/my_components/providers/OnlineGivingProvider";
import axios from "axios";
import { useCallback, useState } from "react";

interface ResponseValue {
  razorpay_order_id: String;
  razorpay_payment_id: String;
  razorpay_signature: String;
}

const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

function Page() {
  const [amount, setAmount] = useState<Number>(0);
  const { ChurchInfo, UserInfo } = useOnlineGivingContext();
  const paymentHandler = useCallback(
    async (e: any) => {
      const { data } = await axios.post("/api/v1/payment", {
        amount,
      });
      console.log(ChurchInfo?.razorpay_api_key);
      if (data.success && ChurchInfo?.razorpay_api_key) {
        const options = {
          key: ChurchInfo?.razorpay_api_key,
          amount: amount,
          currency: "INR",
          name: ChurchInfo?.name,
          description: "Test Transaction",
          image: `${imageUrl}/${ChurchInfo?.imageUrl}`,
          order_id: data.data.orderId,
          handler: async function (response: ResponseValue) {
            const { data } = await axios.post("/api/v1/payment-verification", {
              ...response,
              amount,
            });
            if (data.success) {
              setAmount(0);
            }
          },
          prefill: {
            name: UserInfo?.name,
            email: UserInfo?.email,
            contact: UserInfo?.phone_number,
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };
        const razor = new (window as any).Razorpay(options);
        razor.open();
        e.preventDefault();
      }
    },
    [amount]
  );
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
        value={amount.toString()}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <Button size="lg" className="text-xl my-4" onClick={paymentHandler}>
        Contribute
      </Button>
    </div>
  );
}

export default Page;
