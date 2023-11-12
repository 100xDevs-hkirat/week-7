import { Request, Response } from "express";
import { create_token, token_decrypter } from "../middleware/auth";
import {
  User as UserType,
  Course as CourseType,
  signUpRequest, access_request_validator
} from "../utilities/schema_interfaces";
import { Course, User } from "../db";

export const userRegistraton = async (req: Request, res: Response): Promise<void> => {
    // logic to sign up user
    try{
      const parsedInput = access_request_validator.safeParse(req.body);
    if(!parsedInput.success){
     res.status(411).json({message:"Invalid input", "Error": parsedInput.error});
      return;
    }
     const payload: signUpRequest = parsedInput.data;
      const existing_account = await User.findOne({username:payload.username});
      existing_account && res.status(403).json({message: 'username already exists. Please use another one!'});
      if(!existing_account){
        const new_account = new User(payload);
        await new_account.save();
        res.status(201).json({message: 'User created successfully', token: create_token(req.body)});
      }
    }catch(err){
      res.status(503).json({message: 'Something went wrong', error:err});
    }
  };

export const userLogin = async (req: Request, res: Response): Promise<void> => {
    // logic to log in user
    const {username, password} = req.headers;
    const valid__credentials: UserType | null = await User.findOne({username, password});
    valid__credentials ? res.status(200).send({ message: 'Logged in successfully', token: create_token({username, role:'user'})}): 
    res.status(401).json({message: "Invalid username or password"});
  };

export const fetchAllCourses = async (req: Request, res: Response): Promise<void> => {
    // logic to list all courses
    res.status(200).json({courses: await Course.find({published: true})});
  };

export const purchaseCourse =  async (req: Request, res: Response): Promise<void> => {
    // logic to purchase a course
      const purchasedCourseId: string = req.params["courseId"];
      if(req.headers.authorization){
        const username: string | null = token_decrypter('username', req.headers.authorization.split(' ')[1]);
        const course: CourseType | null = await Course.findById(purchasedCourseId);
        if(course){
            const loggedInUser = await User.findOne({username});
            if(loggedInUser?.purchasedCourse.map((id: { toString: () => any; }) => id.toString()).includes(purchasedCourseId)){
              res.status(403).json({message: "You've already purchased this course. No need to buy it again."});
            }else{
              loggedInUser?.purchasedCourse.push(course);
               await loggedInUser?.save(); 
              res.status(200).json({message: 'Course purchased successfully'});
            }
          }else{
            res.status(403).json({message: 'Invalid course id'});
          }

      }else{
        res.status(401).json({ message:"Unauthorized" });
      }
  };

export const purchasedCourseList =  async (req: Request, res: Response): Promise<void> => {
    // logic to view purchased courses
    if(req.headers.authorization){
        const username: string|null = token_decrypter('username', req.headers.authorization.split(' ')[1]);
        const loggedInUser: UserType | null = await User.findOne({username}).populate('purchasedCourse');
        loggedInUser ? res.status(200).json({purchasedCourses: loggedInUser.purchasedCourse || []}): 
        res.status(403).json({message: 'User not found'});
    }else{
        res.status(401).json({ message:"Unauthorized" });
    }
  };  