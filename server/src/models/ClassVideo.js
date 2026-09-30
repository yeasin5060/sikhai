import mongoose from 'mongoose';

const classVideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, default: '', trim: true, maxlength: 1200 },
    publicId: { type: String, required: true, unique: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    duration: { type: Number, default: 0, min: 0 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

export default mongoose.model('ClassVideo', classVideoSchema);
