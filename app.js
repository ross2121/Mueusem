import express from 'express';
import bodyParser from 'body-parser';
import Stripe from 'stripe';
import fetch from 'node-fetch'; 
import axios from 'axios';

const stripe = Stripe('sk_test_51PngCWDnV1J5iPkhjADPh6ywXKK9PwrAq412HaqxXiALc3DP2BkvvWHchIjl2BsmKFIaJukq3zOFNojVCA3vxbvR003fr1OQRo');

const app = express();
app.use(bodyParser.json({
    verify: (req, res, buf) => {
        const url = req.originalUrl;
        if (url.startsWith('/stripe-webhook')) {
            req.rawbody = buf.toString();
        }
    }
}));

let ticketBookingData = {};

app.post('/webhook', async (req, res) => {
    const intent = req.body.queryResult && req.body.queryResult.intent ? req.body.queryResult.intent.displayName : null;

    if (intent === 'Checkout') {
        const { adultnumber, childnumber } = req.body.queryResult.parameters;
        const totalamount = adultnumber * 200 + childnumber * 50;

        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `Ticket for ${adultnumber} adults and ${childnumber} children`,
                        },
                        unit_amount: totalamount * 100,
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: `https://museum-lilac.vercel.app/sucess`,
                cancel_url: `https://your-domain.com/payment-cancel`,
            });

            ticketBookingData[session.id] = {
                seat: 'A1',
                time: '7:00 PM',
                cinema: 'Cinema 1'
            };

            return res.json({
                
                    "fulfillmentText": `Your Stripe session has been created. You can complete your payment here: ${session.url}`
                  
                  
            });
            
        } catch (error) {
            console.error('Error creating Stripe session: ', error);
            return res.json({
                fulfillmentText: 'There was an issue generating the payment link. Please try again later.',
            });
        }
    } else {
        return res.json({
            fulfillmentText: 'Sorry, I did not understand your request.',
        });
    }
});

app.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.rawbody, sig, 'whsec_t2aJVTqrjk8mrU2AUe3v8ozOFbv4fyH8');
    } catch (err) {
        console.error('Webhook error:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const bookingInfo = ticketBookingData[session.id];
        if (bookingInfo) {
            console.log(`Payment confirmed for seat `);
            axios.post('https://mueusem.onrender.com/webhook', async (req, res) => {        
            return res.json({
                fulfillmentText: `You payment is confirmed`
            });
            })
            console.log("confirm paytmee");
            await sendConfirmationToDialogflow(bookingInfo, session.id);
            delete ticketBookingData[session.id];
        }
    }

    res.status(200).end();
});

async function sendConfirmationToDialogflow(bookingInfo, sessionId) {
    const message = `Your ticket for seat ${bookingInfo.seat} at ${bookingInfo.cinema} for ${bookingInfo.time} is confirmed! Enjoy your show!`;

    await fetch('https://mueusem.onrender.com/webhook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            session: sessionId,
            fulfillmentText: message,
        }),
    });
    console.log(bookingInfo);
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});