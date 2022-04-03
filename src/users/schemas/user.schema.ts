import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const saltOrRounds = 10;

export type UserDocument = User;

@Schema()
export class User extends Document{
    @Prop({required: true, index: { unique: true } })
    username: string;

    @Prop({required: true})
    password: string;

    validatePassword: Function;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next){ var user = this;
    if (!user.isModified('password')) return next();
    
    bcrypt.genSalt(saltOrRounds, function(err, salt) {
        if (err) return next(err);
    
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
    
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.validatePassword = async function (enteredPassword:string) : Promise<boolean>{
    return bcrypt.compare(enteredPassword, this.password);
}


