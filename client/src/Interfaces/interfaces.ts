

export interface ExpertData {
    accountName: string;
    dob: string;
    gender: string;
    contact: string;
    experience: string;
    service: string;
    category: string;
    certificate: File | FileList | null;
}

export interface Category {
    _id: string;
    name: string;
}

export interface Service {
    id: string;
    name: string;
    categoryId: { _id: string };
}

export interface IUser{
    name: string;
    email: string;
    password: string;
    role: "user" | "expert";
    createdAt: Date;
    isGoogleUser: boolean;
    isBlocked:boolean;
    phone:string;
    googleId: string;
    profile_image: string;
    location:{lat:number,lng:number};
    expertStatus:string
    resetPasswordToken: string |undefined; // Changed to string
    resetPasswordExpires: Date |undefined; // Changed to Date
    isVerified: boolean;
  
}

// userId: IUser;
// serviceId: mongoose.Types.ObjectId;
// categoryId: mongoose.Types.ObjectId;
// accountName: string;
// dob: Date;
// status:string;
// gender: "Male" | "Female" | "Other";
// contact: string;
// experience: number;
// isBlocked:boolean;
// certificateUrl: string; // Cloudinary URL
// createdAt?: Date;
// updatedAt?: Date;