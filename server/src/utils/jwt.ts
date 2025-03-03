import { rejects } from 'assert';
import jwt from 'jsonwebtoken'
import { resolve } from 'path';
export const generateAccessToken=(userId:string,role:string)=>{
    return jwt.sign({userId,role},process.env.ACCESS_SECRET as string,{expiresIn:'15m'})
  
}

export const generateRefreshToken = (userId: string,role:string) => {
    return jwt.sign({ userId ,role}, process.env.REFRESH_SECRET as string, { expiresIn: "7d" });
  };

export const verifyToken = (token:string,secret:string)=>{
    return new Promise ((resolve,reject)=>{
        jwt.verify(token,secret,(err,decoded)=>{
            if(err)return reject(err);
            resolve(decoded)
        })

    })
}