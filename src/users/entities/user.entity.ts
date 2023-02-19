import { Exclude } from "class-transformer";
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table, HasMany } from "sequelize-typescript";
import { Activity } from "src/activities/entities/activity.entity";
import { UserActivity } from "src/user-activities/entities/user-activity.entity";

export interface userAttributes {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    activities?: Activity[];
}

@Table({ tableName: "users", timestamps: true })
export class User extends Model<userAttributes, userAttributes> implements userAttributes {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id?: number;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    name?: string;

    @Column({ allowNull: false, type: DataType.STRING(255), unique: true })
    email?: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    @Exclude()
    password?: string;

    @BelongsToMany(() => Activity, () => UserActivity)
    activities?: Activity[];
}