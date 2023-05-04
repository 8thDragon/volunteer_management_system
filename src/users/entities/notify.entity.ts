import { BelongsTo, Column, DataType, ForeignKey, Model, Table, BelongsToMany, HasMany } from "sequelize-typescript";
import { Activity } from "src/activities/entities/activity.entity";
import { User } from "src/users/entities/user.entity";
// import { PdfFile } from "./pdfFile.entity";

export interface notificationAttributes {
    id?: number;
    detail?: string;
    date?: Date;
    is_read?: boolean;
    userId?: number;
    activityId?: number;
}

@Table({ tableName: "notifications", timestamps: true })
export class Notification extends Model<notificationAttributes, notificationAttributes> implements notificationAttributes {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id?: number;

    @Column({ allowNull: false, type: DataType.TEXT })
    detail?: string;

    @Column({ type: DataType.DATEONLY })
    date?: Date;

    @Column({defaultValue: false})
    is_read?: boolean;

    @ForeignKey(() => User)
    @Column
    userId?: number;

    @BelongsTo(() => User, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        hooks: true
    })
    users: User;

    @ForeignKey(() => Activity)
    @Column
    activityId?: number;

    @BelongsTo(() => Activity, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        hooks: true
    })
    activities: Activity;
}