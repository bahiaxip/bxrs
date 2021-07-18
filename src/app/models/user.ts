export interface User {
    _id:string,
    name:string,
    surname:string,
    nick:string,
    email:string,
    password:string,
    city:string,
    phone:string,
    role:string,
    image:{
      original:string,
      name:string,
      ext:string
    }
}
