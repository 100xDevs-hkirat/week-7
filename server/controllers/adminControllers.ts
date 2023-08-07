import { Request, Response } from "express";
import { Course, Admin } from "../db";
import { create_token, token_decrypter } from "../middleware/auth";
import {
  Admin as AdminType,
  Course as CourseType,
  signUpRequest, access_request_validator, create_course_validator
} from "../utilities/schema_interfaces";

export const registerAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  // logic to sign up admin
  try {
    const parsedInput = access_request_validator.safeParse(req.body);
    if(!parsedInput.success){
     res.status(411).json({message:"Invalid input", "Error": parsedInput.error});
      return;
    }
    const payload: signUpRequest = parsedInput.data;
    const username: string = payload.username;
    const existing_account: AdminType | null = await Admin.findOne({
      username,
    });
    existing_account &&
      res
        .status(403)
        .json({ message: "username already exists. Please use another one!" });
    if (!existing_account) {
      const new_account = new Admin(payload);
      // need to finalize type here
      await new_account.save();
      res
        .status(201)
        .json({
          message: "Admin created successfully",
          token: create_token(req.body),
        });
    }
  } catch (err) {
    res.status(503).json({ message: "Something went wrong", error: err });
  }
};

export const adminLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  // logic to log in admin
  const { username, password } = req.headers;
  const parsedInput = access_request_validator.safeParse({ username, password });
    if(!parsedInput.success){
     res.status(411).json({message:"Invalid input for username/password", "Error": parsedInput.error});
      return;
    }
  
  const valid__credentials: AdminType | null = await Admin.findOne({
    username,
    password,
  });
  valid__credentials &&
    res
      .status(200)
      .send({
        message: "Logged in successfully",
        token: create_token({ username, role: "admin" }),
      });
  !valid__credentials &&
    res.status(401).json({ message: "Invalid username or password" });
};

export const createCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  // logic to create a course
  const parsedInput = create_course_validator.safeParse(req.body);
  if(!parsedInput.success){
    res.status(411).json({message:"Invalid input for course fields", error: parsedInput.error});
    return;
  }
  const new_course = new Course(parsedInput.data);
  // need to finalize type here
  await new_course.save();
  res
    .status(200)
    .json({ message: "Course created successfully", courseId: new_course.id });
};

export const updateCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  // logic to edit a course
  try {
    const courseId: string = req.params["courseId"];
    let course_found: CourseType | null = await Course.findByIdAndUpdate(
      courseId,
      req.body,
      { new: true }
    );
    course_found
      ? res.status(200).json({ message: "Course updatd successfully" })
      : res
          .status(404)
          .json({ message: "Invalid course id. Course not found" });
  } catch (err) {
    res.status(404).json({ message: "Invalid course id. Course not found" });
  }
};

export const fetchSpecificCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  // logic to fetch a specific course details
  try {
    const courseId: string = req.params["courseId"];
    let course_found: CourseType | null = await Course.findById(courseId);
    course_found
      ? res.status(200).json(course_found)
      : res
          .status(404)
          .json({ message: "Invalid course id. Course not found" });
  } catch (err) {
    res.status(404).json({ message: "Invalid course id. Course not found" });
  }
};

export const fetchAllCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  // logic to fetch all courses
  res.status(200).json({ courses: await Course.find({}) });
};

export const deleteSpecificCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  // delete a course
  try {
    const courseId: string = req.params["courseId"];
    if (await Course.findById(courseId)) {
      let course_found: CourseType | null = await Course.findByIdAndDelete(
        courseId
      );
      course_found &&
        res.status(200).json({ message: "Course deleted successfully" });
    } else {
      res.status(404).json({ message: "Invalid course id. Course not found" });
    }
  } catch (err) {
    res.status(404).json({ message: "Invalid course id. Course not found" });
  }
};

export const adminDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  if(req.headers.authorization){
    const USERNAME: string | null = await token_decrypter('username', req.headers.authorization?.split(' ')[1]);
  USERNAME  ? res.status(200).json({ username: USERNAME })
    : res.status(403).json({ message: `Admin doesn't exist` });
  }else{
    res.status(401).json({ message:"Unauthorized" });
  }
};
