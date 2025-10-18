import express from 'express';
import {sendEmail} from './utils/email.js';




const app = express();

sendEmail("samalpriyanshu966@gmail.com ", "Test Subject", "This is a test email", "<b>This is a test email</b>");




export default app;