const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    const { body } = event;
    const { priceId, mode = 'payment', quantity = 1, tier = 'lifetime' } = JSON.parse(body);

    if (!priceId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing priceId' }),
        };
    }

    try {
        const sessionParams = {
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity }],
            mode,
            metadata: { product: 'awsprepai_premium', tier },
            success_url: `${process.env.SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CANCEL_URL}`,
        };

        // 3-day free trial for subscription plans only (not lifetime)
        if (mode === 'subscription') {
            sessionParams.subscription_data = { trial_period_days: 3 };
            sessionParams.payment_method_collection = 'always'; // collect card now, charge after trial
        }

        const session = await stripe.checkout.sessions.create(sessionParams);

        return {
            statusCode: 200,
            body: JSON.stringify({ id: session.id, url: session.url }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};