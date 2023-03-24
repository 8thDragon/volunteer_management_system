import { BelongsTo, Column, DataType, ForeignKey, Model, Table, BelongsToMany, HasMany } from "sequelize-typescript";
import { UserActivity } from "src/user-activities/entities/user-activity.entity";
import { User } from "src/users/entities/user.entity";
import { Activity } from "./activity.entity";
// import { PdfFile } from "./pdfFile.entity";

export interface fileAttributes {
    id?: number;
    file_name?: string;
    file_path?: string;
    activityId?: number;
}

@Table({ tableName: "files", timestamps: true })
export class File extends Model<fileAttributes, fileAttributes> implements fileAttributes {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id?: number;

    @Column({ allowNull: false })
    file_name?: string;

    @Column({ allowNull: false })
    file_path?: string;

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