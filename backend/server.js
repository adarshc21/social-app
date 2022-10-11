const app = require('./app');
const dotenv = require('dotenv');
const connectDb = require('./config/db');
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000'
}))

dotenv.config({path:'backend/config/config.env'});
connectDb();

app.listen(process.env.PORT, ()=> {
  console.log('server is working..');
})
