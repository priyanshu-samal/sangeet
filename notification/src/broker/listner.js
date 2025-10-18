import {subscribeToQueue} from './rabbit.js';
import {sendEmail} from '../utils/email.js';

function startListner() {
    subscribeToQueue('user_registration', async (message) => {

        const {email, role, fullname:{firstName, lastName}} = message;

        const emailSubject = 'Welcome to Our Service!';
        const emailBody = `Hello ${firstName} ${lastName},\n\nThank you for signing up as a ${role}. We're excited to have you on board!`;

        await sendEmail(email, emailSubject, emailBody);
    });
}

export default startListner;