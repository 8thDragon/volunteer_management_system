import { Exclude } from "class-transformer";
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table, HasMany } from "sequelize-typescript";
import { Activity } from "src/activities/entities/activity.entity";
import { UserActivity } from "src/user-activities/entities/user-activity.entity";
import cryptoRandomString from "crypto-random-string";
import { v4 as uuidv4 } from 'uuid'
import { Comment } from "src/activities/entities/comment.entity";
import { Notification } from "./notify.entity";
// import * as nodemailer from 'nodemailer'

// declare function require(name:string);
const nodemailer = require('nodemailer')

export interface userAttributes {
    id?: number;
    name?: string;
    lastname?: string;
    nickname?: string;
    gender?: string;
    religion?: string;
    phoneNumber?: string;
    career?: string;
    workplace?: string;
    congenitalDisease?: string;
    allergicFood?: string;
    talent?: string;
    know_from?: string;
    birthday?: Date;
    received_hours?: number;
    non_blacklist?: boolean;
    emailVerificationToken?: string;
    admin?: boolean;
    passwordResetToken?: string;
    emailVerified?: boolean;
    email?: string;
    password?: string;
    comments?: Comment;
    notify?: Notification;
    activities?: Activity[];
}

@Table({ tableName: "users", timestamps: true })
export class User extends Model<userAttributes, userAttributes> implements userAttributes {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id?: number;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    name?: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    lastname?: string;

    @Column({ allowNull: true, type: DataType.STRING(255) })
    nickname?: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    gender?: string;

    @Column({ allowNull: true, type: DataType.STRING(255) })
    religion?: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    phoneNumber?: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    career?: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    workplace?: string;

    @Column({ allowNull: true, type: DataType.STRING(255) })
    congenitalDisease?: string;

    @Column({ allowNull: true, type: DataType.STRING(255) })
    allergicFood?: string;

    @Column({ allowNull: true, type: DataType.STRING(255) })
    talent?: string;

    @Column({ allowNull: true, type: DataType.STRING(255) })
    know_from?: string;

    @Column({ allowNull: false, type: DataType.DATEONLY })
    birthday?: Date;

    @Column({ allowNull: true, defaultValue: 0 })
    received_hours?: number;

    @Column({ allowNull: false, type: DataType.BOOLEAN(), defaultValue: true})
    non_blacklist?: boolean;

    @Column({ })
    emailVerificationToken?: string;
    
    @Column({ })
    passwordResetToken?: string;

    @Column({ defaultValue: false })
    emailVerified?: boolean;

    @Column({defaultValue: false})
    admin?: boolean;

    @Column({ allowNull: false, type: DataType.STRING(255), unique: true })
    email?: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    @Exclude()
    password?: string;

    // @HasMany(() => UserActivity, {
    //   onUpdate: "CASCADE",
    //   onDelete: "CASCADE",
    //   hooks: true
    // })
    // userActivities?: UserActivity[];

    @HasMany(() => Comment, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      hooks: true
    })
    comments?: Comment;

    @HasMany(() => Notification, {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      hooks: true
    })
    notify?: Notification;

    // @BelongsToMany(() => Activity, () => UserActivity)
    // activities?: Activity[];

    generateEmailVerificationToken() {
        this.emailVerificationToken = uuidv4();
    }
    generatePasswordResetToken() {
        this.passwordResetToken = uuidv4();
    }

    async sendVerificationEmail() {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'ickevinsheriff@gmail.com',
            pass: 'bxjanvlgpmquxnar'
          }
        });
    
        const info = await transporter.sendMail({
          from: 'ickevinsheriff@gmail.com',
          to: this.email,
          subject: 'Verify your email address',
          text: 'Please click the following link to verify your email address:',
          html: `<p>Please click the following link to verify your email address:</p>
                <a href="http://localhost:8000/users/verify-email?token=${this.emailVerificationToken}">Verify email address</a>`
        });
    
        console.log(`Verification email sent: ${info.messageId}`);
    }

    async sendPasswordResetEmail() {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'ickevinsheriff@gmail.com',
          pass: 'bxjanvlgpmquxnar'
        }
      });
  
      const info = await transporter.sendMail({
        from: 'ickevinsheriff@gmail.com',
        to: this.email,
        subject: 'Reset your password',
        text: 'Please click the following link to reset your password:',
        html: `<p>Please click the following link to verify your email address:</p>
        <a href="http://localhost:4200/confirm-password?token=${this.passwordResetToken}">Reset password</a>`
      });
  
      console.log(`Password reset email sent: ${info.messageId}`);
    }
}