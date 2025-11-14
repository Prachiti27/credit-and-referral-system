import { model, Schema, Types } from "mongoose";

export interface IUser extends Document{
    name: string;
    email: string;
    passwordHash : string;
    referralCode: string;
    referredBy? : Types.ObjectId;
    credits : number;
    createdAt : Date;
    updatedAt : Date;
}

const userSchema = new Schema<IUser>(
    {
        name: {type:String,required:true},
        email:{type:String,required:true,unique:true},
        passwordHash: {type:String,required:true},
        referralCode: {type:String,required:true,unique:true},
        referredBy: {type:Schema.Types.ObjectId,ref:'User',default:null},
        credits: {type:Number,default:0},
    },
    {timestamps:true}
);

export const User = model<IUser>('User',userSchema);