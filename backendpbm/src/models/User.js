import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'required name'],
        trim: true,
        minlength: 2,
        maxlength: 100,
    },

    email: {
        type: String,
        required: [true, 'required email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+\@.+\..+/, 'invalid email format']
    },

    password: {
        type: String,
        required: [true, 'required password'],
        minlength: 6,
        select: false
    }
}, {
    timestamps: true
})

// utilizando o bcrypt para colocar hash na senha antes de salvar

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User