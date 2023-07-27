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

  export type signUpRequest = {
    username: string,
    password: string,
  }

  export type loginRequest = {
    username: string| string[] | undefined,
    password: string| string[] | undefined,
  }