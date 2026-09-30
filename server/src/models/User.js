import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    password: {
      type: String,
      required: function passwordRequired() { return !this.googleId; },
      minlength: 8,
      select: false,
    },
    googleId: { type: String, unique: true, sparse: true, select: false },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
  },
  { timestamps: true },
);

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  if (!this.password) return Promise.resolve(false);
  return bcrypt.compare(candidate, this.password);
};

userSchema.statics.createGoogleStudent = function createGoogleStudent(profile) {
  return this.create({
    name: profile.name,
    email: profile.email,
    googleId: profile.googleId,
    role: 'student',
  });
};

export default mongoose.model('User', userSchema);
