import { BelongsTo, Column, DataType, ForeignKey, Model, Table, BelongsToMany } from "sequelize-typescript";
import { Activity } from "src/activities/entities/activity.entity";
import { User } from "src/users/entities/user.entity";

export interface userActivityAttributes {
    id?: number;
    userActivityName?: string;
    picture_activity?: string;
    userId?: number[];
    ratedUser?: number[];
    activityId?: number;
    activities: Activity;
    date?: Date;
    is_started?: boolean;
    is_ended?: boolean;
    canceled?: boolean;
    ratings?: number;
}

@Table({ tableName: "user_activities", timestamps: true })
export class UserActivity extends Model<userActivityAttributes, userActivityAttributes> implements userActivityAttributes {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id?: number;

    @Column({})
    userActivityName?: string;

    @Column({ allowNull: true })
    picture_activity?: string;

    // @ForeignKey(() => User)
    @Column({ type: DataType.ARRAY(DataType.INTEGER), defaultValue: Array })
    userId?: number[];

    @Column({ type: DataType.ARRAY(DataType.INTEGER), defaultValue: Array })
    ratedUser?: number[];

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

    @Column({ allowNull: false, defaultValue: false })
    is_started?: boolean;

    @Column({allowNull: false, type: DataType.BOOLEAN(), defaultValue: false })
    is_ended?: boolean;

    @Column({allowNull: false, defaultValue: false })
    canceled?: boolean;

    @Column({ defaultValue: 0 })
    ratings?: number;
}
