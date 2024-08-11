import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const clientSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is Required"]
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
  // mainUser: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true,
  //   unique: true,
  // },
}, {
  timestamps: true,
});
// Encrypt password and save in database
clientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Update the updatedDate field before each save
clientSchema.pre("save", function (next) {
  this.updatedDate = Date.now();
  next();
});

// Check password 
clientSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate Access and Refresh Token through JWT
// Access Token
clientSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      clientId: this.clientId,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );
};

// Refresh Token
clientSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );
};


export const Client = mongoose.model('Client', clientSchema);
