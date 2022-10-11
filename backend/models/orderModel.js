const {Schema, default: mongoose} = require('mongoose');

const OrderSchema = new Schema({
  shippingInfo: {
    address: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    country: {type: String, default: 'India'},
    pinCode: {type: Number, required: true},
    phoneNo: {type: Number, required: true}
  },
  orderItems: [{
    name: {type: String, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    image: {type: String, required: true},
    product: {type: mongoose.Schema.ObjectId, ref:'Product', required: true}
  }],
  paymentInfo: {
    _id: {type: String, required: true},
    status: {type: String, required: true},
  },
  paidAt: {
    type: Date,
    required: true
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  orderStatus: {
    type: String,
    required: true,
    default: 'processing',
  },
  deliveredAt: {
    type: Date,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Order', OrderSchema);