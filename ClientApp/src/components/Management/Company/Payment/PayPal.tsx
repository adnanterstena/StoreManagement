import * as React from 'react';
import { useRef, useEffect } from 'react';
declare global {
    interface Window {
        paypal: any;
    }
}
  

export default function PayPal(props: { changePaymentToTrue: any }){
    const paypal: any = useRef()
    useEffect(() => {
        window.paypal.Buttons({
            createOrder: (data: any, actions: any, err: any)=> {
                return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                        {
                            description: "Payment for Toko B.M App",
                            amount: {
                                currency_code: "USD",
                                value: 15.00,
                            }
                        }
                    ]
                })
            },
            onApprove: async (data:any, actions:any) => {
                props.changePaymentToTrue();
            },
            onError: (err:any) => {
                console.log(err)
            }
        }).render(paypal.current)

    })

    return (
        <div>
            <div ref={paypal}></div>
        </div>
    )
}
