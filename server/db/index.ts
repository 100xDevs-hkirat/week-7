import { Schema, model } from "mongoose";

// Define mongoose schemas
const userSchema: Schema = new Schema({
    username: {type: String},
    password: String,
    purchasedCourse: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
  });
  
const adminSchema: Schema = new Schema({
    username: String,
    password: String
  });
  
const courseSchema: Schema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean
  });

export const User = model('User', userSchema);
export const Admin = model('Admin', adminSchema);
export const Course = model('Course', courseSchema);
  