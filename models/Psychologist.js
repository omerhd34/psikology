import mongoose from 'mongoose';

const PsychologistSchema = new mongoose.Schema({
 userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
 },
 name: {
  type: String,
  required: true
 },
 title: {
  type: String,
  default: 'Psikolog'
 },
 about: {
  type: String,
  default: ''
 },
 education: [{
  type: String
 }],
 experience: [{
  type: String
 }],
 specialties: [{
  type: String
 }],
 image: {
  type: String,
  default: '/images/default-avatar.png'
 },
 phone: {
  type: String,
  default: ''
 },
 email: {
  type: String,
  required: true
 },
 availableDays: [{
  type: String
 }],
 availableHours: {
  start: { type: String, default: '09:00' },
  end: { type: String, default: '17:00' }
 },
 sessionDuration: {
  type: Number,
  default: 50 // dakika
 },
 sessionFee: {
  type: Number,
  default: 0
 },
 isActive: {
  type: Boolean,
  default: true
 },
 isApproved: {
  type: Boolean,
  default: false
 },
 rating: {
  type: Number,
  default: 0
 },
 totalSessions: {
  type: Number,
  default: 0
 }
}, { timestamps: true });

// Index'ler
PsychologistSchema.index({ userId: 1 });
PsychologistSchema.index({ isActive: 1, isApproved: 1 });

export default mongoose.models.Psychologist || mongoose.model('Psychologist', PsychologistSchema);

