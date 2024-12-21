const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {type: String, maxLength: 255, required: true},
  password: {type: String, maxLength: 255, required: true},
  email: {type: String, maxLength: 255, required: true},
  phone: {type: String, maxLength: 255},
  address: {type: String, maxLength: 255 },
  role: {
    type: String, 
    enum: [2002, 2004, 2006],
    default: 2004,
  },
  avatar: {
    url: String,
    public_id: String
  },
  wishlist: [{type: mongoose.Types.ObjectId, ref: 'Product'}],
  isBlocked: { type: Boolean, default: false},
  refreshToken: {type: String},
  passwordChangedAt: {type: String},
  passwordResetToken: {type: String},
  passwordResetExpires: {type: String},  
  registerToken: {type: String},
  voucher: [
    {
      voucherId: {type: mongoose.Types.ObjectId, ref: 'Voucher'},
      useCount: {type: Number, default: 0},
      createdAt: { type: Date, default: Date.now },
    }
  ],
  accumulate: {
    points: {type: Number, default: 0, min: 0},
    rank: {type: String, default: 'Vô hạng'}  
  },
}, {
  timestamps: true,
});

// Middleware để cập nhật rank dựa trên số điểm tích lũy
userSchema.pre('save', function(next) {
  const user = this;

  // Kiểm tra nếu điểm đã tồn tại hoặc bị thay đổi
  if (user.accumulate && user.isModified('accumulate.points')) {
    if (user.accumulate.points > 0) {
      if (user.accumulate.points >= 10000) {
        user.accumulate.rank = 'Vip';    
      } else if(user.accumulate.points >= 5000){// Hạng Kim Cương từ 5000 điểm trở lên
        user.accumulate.rank = 'Kim cương';   
      } else if (user.accumulate.points >= 2000) {
        user.accumulate.rank = 'Vàng';         // Hạng Vàng từ 2000 đến 4999 điểm
      } else if (user.accumulate.points >= 1000) {
        user.accumulate.rank = 'Bạc';          // Hạng Bạc từ 1000 đến 1999 điểm
      } else {
        user.accumulate.rank = 'Đồng';         // Hạng Đồng dưới 1000 điểm
      }
    } else {
      user.accumulate.rank = null;  // Nếu điểm = 0, người dùng không có hạng
    }
  }

  next();
});
userSchema.pre('save', function(next) {
  const user = this;

  next();
});

// Middleware để hash password trước khi lưu vào database
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.methods = {
  isCorrectPassword: async function(password) {
    return await bcrypt.compare(password, this.password);
  },
  createPasswordChangeToken: function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 phút
    return resetToken;
  }
};

module.exports = mongoose.model('User', userSchema);
