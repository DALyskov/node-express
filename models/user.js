const {Schema, model} = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  avatarUrl: String,
  resetInfo: {
    token: String,
    tokenExp: Date,
  },
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        courseId: {
          type: Schema.Types.ObjectId,
          ref: 'Course',
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addCourse = function(course) {
  const items = [...this.cart.items];
  const idx = items.findIndex(c => `${c.courseId}` === `${course._id}`);

  if (idx >= 0) {
    items[idx].count++;
  } else {
    items.push({courseId: course._id});
  }

  this.cart.items = items;
  return this.save();
};

userSchema.methods.removeFromCart = function(courseId) {
  let items = [...this.cart.items];
  const idx = items.findIndex(c => `${c.courseId}` === `${courseId}`);
  if (items[idx].count === 1) {
    items = items.filter(c => `${c.courseId}` !== `${courseId}`);
  } else {
    items[idx].count--;
  }

  this.cart.items = items;
  return this.save();
};

userSchema.methods.clearCart = function() {
  this.cart = {items: []};
  return this.save();
};

module.exports = model('User', userSchema);
