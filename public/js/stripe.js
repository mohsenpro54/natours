/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51JdWuMHcDosX9q2Y79gR9OsX03aqFiDSoKUevbG190UkRABMEAIY6s3t5d8OQQIoSPov6PEk5jr8DCxyb0llGY8z00HcjEwEH2'
);
export const bookTour = async (tourId) => {
  try {
    /// 1) get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);
    /////2) create checkout from+ chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
