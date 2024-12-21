import React, { useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { apiCreateOrder } from '../../../apis';
import Swal from 'sweetalert2';
import { removeAllCart } from '../../../store/user/userSlice';
import { useDispatch } from 'react-redux';

const style = { "layout": "vertical" };

const ButtonWrapper = ({ showSpinner, currency, amount, payload, setIsSuccess }) => {
    const dispatch = useDispatch();
    const [{ isPending, options }, dispatchPaypal] = usePayPalScriptReducer();

    useEffect(() => {
        dispatchPaypal({
            type: 'resetOptions',
            value: {
                ...options,
                currency: currency
            }
        });
    }, [currency, showSpinner]);
    const handleSaveOrder = async() =>{
        const response = await apiCreateOrder({...payload});
        try{
            if(response.success){
                setIsSuccess(true);
                dispatch(removeAllCart());
                setTimeout(() => {
                    Swal.fire( 'Congratulations' , response.mes, 'success' );
                }, 500)
            }else{
                Swal.fire( 'Oop!' , response.mes, 'error' );
            }
        }catch(response){
            console.log(response)
        }
    }

    return (
        <>
            {(showSpinner && isPending) && <div className="spinner"></div>}
            <PayPalButtons
                createOrder={(data, actions) => actions.order.create({
                    purchase_units: [
                        {amount: {currency_code: currency, value: amount}}
                    ]
                }).then(orderId =>orderId)}
                onApprove={(data, actions) => actions.order.capture().then(async(response) => {
                    if(response.status === 'COMPLETED'){
                        handleSaveOrder()
                    }
                })}
                forceReRender={[style, currency, amount]}
                fundingSource={undefined}
                style={style}
                disabled={false}
            />
        </>
    );
};

export default function Paypal({ amount, payload, setIsSuccess}) {
    return (
        <div style={{ maxBlockSize: "750px", minHeight: "200px" }}>
            <PayPalScriptProvider options={{ clientId: "test", components: "buttons", currency: "USD" }}>
                <ButtonWrapper  setIsSuccess={setIsSuccess} payload ={payload} currency={'USD'} amount={amount} showSpinner={false} />
            </PayPalScriptProvider>
        </div>
    );
}
