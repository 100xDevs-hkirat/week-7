import {z} from "zod";

export interface Admin{
    _id?: string | undefined,
    username: string,
    password: string
  }
  
  export interface User extends Admin{
    purchasedCourse: string[]
  }

  export interface Course{
    _id?: string | unknown,
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean
  }

  export type loginRequest = {
    username: string| string[] | undefined,
    password: string| string[] | undefined,
  }

  export const access_request_validator = z.object({
    username : z.string().min(3).max(20),
    password: z.string().min(8).max(30)
  });

  export const create_course_validator = z.object({
    title     : z.string().min(5).max(150),
    description   : z.string().min(1).max(500),
    price       : z.number().lt(9999),
    imageLink      : z.string().max(200),
    published        : z.boolean().default(false)
  });

  export type updateCourse_validator = Partial<z.infer<typeof create_course_validator>>;

  export type signUpRequest = z.infer<typeof access_request_validator>;

  