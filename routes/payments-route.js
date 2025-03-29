import Stripe from 'stripe';
const stripe = new Stripe("sk_test_51R7JcpFQCb3azoPOA3EKPYPf9j4xjcYs42ssulZO3kk1VP9tgzwX2i4mwxeZqDL6yv4WnR4lMcYqc1kO4M1Yp6aS00yWjjnDSZ");
import express from 'express';
const router = express.Router();
import validateToken from '../middlewares/validate-token.js';

router.post('/create-payment-intent', validateToken, async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount * 100,
            currency: 'gbp',
            description:'events-hub full stack application',
            metadata: {integration_check: 'accept_a_payment'},
        });

        res.status(200).json({clientSecret: paymentIntent.client_secret});
    } catch (error) {
        res.status(500).send('An error occurred while creating the payment intent');
        console.log("the following error occured:", error)
        
    }
})

export default router;