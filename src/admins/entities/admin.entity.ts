import { BelongsTo, Column, DataType, ForeignKey, Model, Table, BelongsToMany } from "sequelize-typescript";

export interface adminAttributes {
    userId?: number;
    adminName?: number;
    adminPassword?: number;
}

@Table({ tableName: "admins", timestamps: true })
export class Admin extends Model<adminAttributes, adminAttributes> implements adminAttributes {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id?: number;

    @Column
    adminName?: number;

    @Column
    adminPassword?: number;
}

