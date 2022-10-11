const mongoose = require('mongoose');

module.exports = connectDb = () => {
  mongoose.connect(process.env.MONGO_URI)
  .then( () => console.log('mongoose is connected..'))
  .catch( (error) => console.log(error) )
}