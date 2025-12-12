import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
 psychologistId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Psychologist',
  required: true
 },
 clientName: {
  type: String,
  required: true
 },
 clientEmail: {
  type: String,
  required: true
 },
 clientPhone: {
  type: String,
  required: true
 },
 appointmentDate: {
  type: Date,
  required: true
 },
 appointmentTime: {
  type: String,
  required: true
 },
 duration: {
  type: Number,
  default: 50 // dakika
 },
 status: {
  type: String,
  enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
  default: 'pending'
 },
 notes: {
  type: String,
  default: ''
 },
 sessionType: {
  type: String,
  enum: ['online', 'in-person'],
  default: 'online'
 },
 price: {
  type: Number,
  required: true
 },
 paymentStatus: {
  type: String,
  enum: ['unpaid', 'paid', 'refunded'],
  default: 'unpaid'
 },
 cancelReason: {
  type: String,
  default: ''
 },
 reminderSent: {
  type: Boolean,
  default: false
 }
}, { timestamps: true });

// Index'ler
AppointmentSchema.index({ psychologistId: 1, appointmentDate: 1 });
AppointmentSchema.index({ status: 1 });
AppointmentSchema.index({ clientEmail: 1 });

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);

