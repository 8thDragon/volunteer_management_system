import { BelongsTo, Column, DataType, ForeignKey, Model, Table, BelongsToMany } from "sequelize-typescript";
import { Activity } from "src/activities/entities/activity.entity";
import { User } from "src/users/entities/user.entity";

export interface userActivityAttributes {
    userId?: number;
    activityId?: number;
    date?: Date[];
}

@Table({ tableName: "user_activities", timestamps: true })
export class UserActivity extends Model<userActivityAttributes, userActivityAttributes> implements userActivityAttributes {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id?: number;

    @ForeignKey(() => User)
    @Column
    userId?: number;

    @ForeignKey(() => Activity)
    @Column
    activityId?: number;

    @Column({ type: DataType.ARRAY(DataType.DATEONLY), defaultValue: Array })
    date?: Date[];
}
