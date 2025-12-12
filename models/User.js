import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
 name: {
  type: String,
  required: true
 },
 email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true
 },
 password: {
  type: String,
  required: true
 },
 role: {
  type: String,
  enum: ['admin', 'psychologist', 'user'],
  default: 'user'
 },
 isActive: {
  type: Boolean,
  default: true
 },
 lastLogin: {
  type: Date
 }
}, { timestamps: true });

// Index'ler
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export default mongoose.models.User || mongoose.model('User', UserSchema);