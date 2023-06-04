import { BelongsTo, Column, DataType, ForeignKey, Model, Table, BelongsToMany } from "sequelize-typescript";
import { Activity } from "src/activities/entities/activity.entity";
import { User } from "src/users/entities/user.entity";
import { UserActivity } from "./user-activity.entity";

export interface SingleUserActivityAttributes {
    id?: number;
    user_name?: string;
    userActivityName?: string;
    userId?: number;
    userActivityId?: number;
    userActivities: UserActivity;
    users: User;
    date?: Date;
    ratings?: number;
}

@Table({ tableName: "single_user_activities", timestamps: true })
export class SingleUserActivity extends Model<SingleUserActivityAttributes, SingleUserActivityAttributes> implements SingleUserActivityAttributes {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id?: number;

    @Column({})
    user_name?: string;

    @Column({})
    userActivityName?: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.ARRAY(DataType.INTEGER) })
    userId?: number;

    @ForeignKey(() => UserActivity)
    @Column
    userActivityId?: number;

    @BelongsTo(() => UserActivity, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        hooks: true
    })
    userActivities: UserActivity;

    @BelongsTo(() => User, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        hooks: true
    })
    users: User;

    @Column({ allowNull: false, type: DataType.DATEONLY})
    date?: Date;

    @Column({ defaultValue: 0 })
    ratings?: number;
}