import { Exclude } from "class-transformer";
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table, HasMany } from "sequelize-typescript";
import { Activity } from "src/activities/entities/activity.entity";
import { UserActivity } from "src/user-activities/entities/user-activity.entity";

export interface userAttributes {
    id?: number;
    name?: string;
    nickname?: string;
    gender?: string;
    religion?: string;
    phoneNumber?: string;
    career?: string;
    workplace?: string;
    congenitalDisease?: string;
    allergicFood?: string;
    birthday?: Date;
    non_blacklist?: boolean;
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

    @Column({ allowNull: false, type: DataType.STRING(255) })
    nickname?: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    gender?: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    religion?: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    phoneNumber?: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    career?: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    workplace?: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    congenitalDisease?: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    allergicFood?: string;

    @Column({ allowNull: false })
    birthday?: Date;

    @Column({ allowNull: false, type: DataType.BOOLEAN(), defaultValue: true})
    non_blacklist?: boolean;

    @Column({ allowNull: false, type: DataType.STRING(255), unique: true })
    email?: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    @Exclude()
    password?: string;

    @BelongsToMany(() => Activity, () => UserActivity)
    activities?: Activity[];
}