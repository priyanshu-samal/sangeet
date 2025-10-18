import app from './src/app.js';
import { connect } from './src/broker/rabbit.js';
import startListner from './src/broker/listner.js';

connect().then(startListner);


app.listen(3001, () => {
  console.log('Notification Server is running on port 3001');
});