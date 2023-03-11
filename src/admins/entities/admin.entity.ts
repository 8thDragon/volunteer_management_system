import { Exclude } from "class-transformer";
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table, HasMany } from "sequelize-typescript";
import { Activity } from "src/activities/entities/activity.entity";
import { UserActivity } from "src/user-activities/entities/user-activity.entity";
import cryptoRandomString from "crypto-random-string";
import { v4 as uuidv4 } from 'uuid'
// import * as nodemailer from 'nodemailer'

// declare function require(name:string);

export interface adminAttributes {
    id?: number;
    name?: string;
    password?: string;
}

@Table({ tableName: "admins", timestamps: true })
export class Admin extends Model<adminAttributes, adminAttributes> implements adminAttributes {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id?: number;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    name?: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    @Exclude()
    password?: string;
}