import mongoose from 'mongoose';

const AdvertisementSchema = new mongoose.Schema({
 title: {
  type: String,
  required: true
 },
 slug: {
  type: String,
  required: true,
  unique: true
 },
 content: {
  type: String,
  required: true
 },
 excerpt: {
  type: String,
  default: ''
 },
 featuredImage: {
  type: String,
  default: ''
 },
 images: [{
  type: String
 }],
 category: {
  type: String,
  enum: ['blog', 'haber', 'etkinlik', 'makale', 'duyuru'],
  default: 'blog'
 },
 tags: [{
  type: String
 }],
 author: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
 },
 authorName: {
  type: String,
  default: 'Admin'
 },
 status: {
  type: String,
  enum: ['draft', 'published', 'archived'],
  default: 'draft'
 },
 publishDate: {
  type: Date,
  default: Date.now
 },
 viewCount: {
  type: Number,
  default: 0
 },
 featured: {
  type: Boolean,
  default: false
 },
 seo: {
  metaTitle: String,
  metaDescription: String,
  metaKeywords: [String]
 }
}, { timestamps: true });

// Index'ler
AdvertisementSchema.index({ slug: 1 });
AdvertisementSchema.index({ status: 1, publishDate: -1 });
AdvertisementSchema.index({ category: 1 });
AdvertisementSchema.index({ featured: 1 });

export default mongoose.models.Advertisement || mongoose.model('Advertisement', AdvertisementSchema);

