import { BelongsTo, Column, DataType, ForeignKey, Model, Table, BelongsToMany } from "sequelize-typescript";
import { Activity } from "src/activities/entities/activity.entity";
import { User } from "src/users/entities/user.entity";

export interface userActivityAttributes {
    userId?: number[];
    userIdConfirmed?: number[];
    activityId?: number;
    activities: Activity;
    date?: Date;
}

@Table({ tableName: "user_activities", timestamps: true })
export class UserActivity extends Model<userActivityAttributes, userActivityAttributes> implements userActivityAttributes {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id?: number;

    // @ForeignKey(() => User)
    @Column({ type: DataType.ARRAY(DataType.INTEGER), defaultValue: Array })
    userId?: number[];

    @Column({ type: DataType.ARRAY(DataType.INTEGER), defaultValue: Array })
    userIdConfirmed?: number[];

    @ForeignKey(() => Activity)
    @Column
    activityId?: number;

    @BelongsTo(() => Activity, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        hooks: true
    })
    activities: Activity;

    @Column({ allowNull: false, type: DataType.DATEONLY})
    date?: Date;
}
