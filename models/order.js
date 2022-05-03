const {Schema, model} = require('mongoose');

const orederShema = new Schema({
  courses: [
    {
      course: {
        type: Object,
        required: true,
      },
      count: {
        type: Number,
        required: true,
      },
    },
  ],
  user: {
    name: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      requierd: true,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('Order', orederShema);
