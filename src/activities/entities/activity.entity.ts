import { BelongsTo, Column, DataType, ForeignKey, Model, Table, BelongsToMany } from "sequelize-typescript";
import { UserActivity } from "src/user-activities/entities/user-activity.entity";
import { User } from "src/users/entities/user.entity";

export interface activityAttributes {
    id?: number;
    activity_name?: string;
    activity_details?: string;
    regised_number?: number;
    size_number?: number;
    received_hours?: number;
    map?: string;
    start_date?: Date;
    end_date?: Date;
    is_open?: boolean;
    users?: User[];
}

@Table({ tableName: "activities", timestamps: true })
export class Activity extends Model<activityAttributes, activityAttributes> implements activityAttributes {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id?: number;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    activity_name?: string;

    @Column({ allowNull: false })
    activity_details?: string;

    @Column({ allowNull: true })
    regised_number?: number;

    @Column({ allowNull: false })
    size_number?: number;

    @Column({ allowNull: false })
    received_hours?: number;

    @Column({ allowNull: false })
    map?: string;

    @Column({ allowNull: false })
    start_date?: Date;

    @Column({ allowNull: true })
    end_date?: Date;

    @Column({ allowNull: false })
    is_open?: boolean;

    @BelongsToMany(() => User, () => UserActivity)
    users: User[];
}