import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 180 },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    onlinePrice: { type: Number, required: true, min: 0 },
    offlinePrice: { type: Number, required: true, min: 0 },
    duration: { type: String, required: true, trim: true, maxlength: 80 },
    students: { type: Number, default: 0, min: 0 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    image: { type: String, default: '' },
    instructor: { type: String, default: '', trim: true, maxlength: 120 },
    level: { type: String, default: '', trim: true, maxlength: 80 },
    prerequisites: { type: String, default: '', trim: true, maxlength: 1000 },
    learningOutcomes: { type: [String], default: [] },
    curriculum: { type: [String], default: [] },
    published: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

export default mongoose.model('Course', courseSchema);
