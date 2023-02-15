import { Exclude } from "class-transformer";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";

export interface userAttributes {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
}

@Table({ tableName: "user", timestamps: true })
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
}