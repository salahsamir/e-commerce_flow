
import Stripe from 'stripe';
export async function payments({
    stripe=new Stripe(process.env.SECRET_KEY),
    payment_method_types=['card'],
    mode="payment",
    customer_email,
    metadata={},
    cancel_url=process.env.CANCLEL,
    success_url=process.env.SUCCESS,
    discounts=[],
    line_items=[]
}={}){
    
    const session=await stripe.checkout.sessions.create({
        payment_method_types,
        mode,
        customer_email,
        metadata,
        cancel_url,
        success_url,
        discounts,
        line_items
    })
    return session

}
