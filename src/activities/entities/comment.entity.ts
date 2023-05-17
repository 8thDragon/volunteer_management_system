import { BelongsTo, Column, DataType, ForeignKey, Model, Table, BelongsToMany, HasMany } from "sequelize-typescript";
import { User } from "src/users/entities/user.entity";
import { Activity } from "./activity.entity";
// import { PdfFile } from "./pdfFile.entity";

export interface commentAttributes {
    id?: number;
    activity_name?: string;
    user_name?: string;
    comment_detail?: string;
    activity_date?: Date;
    comment_date?: Date;
    activityId?: number;
    userId?: number;
}

@Table({ tableName: "comments", timestamps: true })
export class Comment extends Model<commentAttributes, commentAttributes> implements commentAttributes {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id?: number;

    @Column({ allowNull: false, type: DataType.TEXT })
    activity_name?: string;

    @Column({ allowNull: false, type: DataType.TEXT })
    user_name?: string;

    @Column({ allowNull: false, type: DataType.TEXT })
    comment_detail?: string;

    @Column({ type: DataType.DATEONLY })
    activity_date?: Date;

    @Column({ type: DataType.DATEONLY })
    comment_date?: Date;

    @ForeignKey(() => Activity)
    @Column
    activityId?: number;

    @BelongsTo(() => Activity, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        hooks: true
    })
    activities: Activity;

    @ForeignKey(() => User)
    @Column
    userId?: number;

    @BelongsTo(() => User, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        hooks: true
    })
    users: User;
}