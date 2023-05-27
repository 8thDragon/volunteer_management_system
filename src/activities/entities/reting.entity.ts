import { BelongsTo, Column, DataType, ForeignKey, Model, Table, BelongsToMany, HasMany } from "sequelize-typescript";
import { User } from "src/users/entities/user.entity";
import { Activity } from "./activity.entity";
import { UserActivity } from "src/user-activities/entities/user-activity.entity";
// import { PdfFile } from "./pdfFile.entity";

export interface ratingAttributes {
    id?: number;
    rated_point?: number;
    userActivityId?: number;
    activityId?: number;
    userId?: number;
}

@Table({ tableName: "ratings", timestamps: true })
export class Rating extends Model<ratingAttributes, ratingAttributes> implements ratingAttributes {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id?: number;

    @Column({ allowNull: true})
    rated_point?: number;

    @Column({ allowNull: false})
    userId?: number;
    
    @Column({ allowNull: false})
    userActivityId?: number;

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