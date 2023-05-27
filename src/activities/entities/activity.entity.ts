import { BelongsTo, Column, DataType, ForeignKey, Model, Table, BelongsToMany, HasMany, HasOne } from "sequelize-typescript";
import { Comment } from "./comment.entity";
import { UserActivity } from "src/user-activities/entities/user-activity.entity";
import { User } from "src/users/entities/user.entity";
import { File } from "./file.entity";
import { Notification } from "src/users/entities/notify.entity";
import { Rating } from "./reting.entity";
// import { PdfFile } from "./pdfFile.entity";

export interface activityAttributes {
    id?: number;
    activity_name?: string;
    activity_details?: string;
    time_detail?: string;
    clothes_detail?: string;
    etc_detail?: string;
    travel_detail?: string;
    travel_public_detail?: string;
    travel_etc_detail?: string;
    timeline?: string;
    regised_number?: number;
    size_number?: number;
    received_hours?: number;
    map?: string;
    start_date?: Date;
    end_date?: Date;
    is_open?: boolean;
    picture?: string;
    priority?: number;
    ratings?: Rating[];
    files?: File[];
    userActivities?: UserActivity[];
    comments?: Comment;
    notify?: Notification;
}

@Table({ tableName: "activities", timestamps: true })
export class Activity extends Model<activityAttributes, activityAttributes> implements activityAttributes {

    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    id?: number;

    @Column({ allowNull: false, type: DataType.TEXT })
    activity_name?: string;

    @Column({ allowNull: true, type: DataType.TEXT })
    activity_details?: string;

    @Column({ allowNull: true, type: DataType.TEXT })
    time_detail?: string;

    @Column({ allowNull: true, type: DataType.TEXT })
    clothes_detail?: string;

    @Column({ allowNull: true, type: DataType.TEXT })
    etc_detail?: string;

    @Column({ allowNull: true, type: DataType.TEXT })
    travel_detail?: string;

    @Column({ allowNull: true, type: DataType.TEXT })
    travel_public_detail?: string;
    
    @Column({ allowNull: true, type: DataType.TEXT })
    travel_etc_detail?: string;

    @Column({ allowNull: true, type: DataType.TEXT })
    timeline?: string;

    @Column({ allowNull: true })
    regised_number?: number;

    @Column({ allowNull: false })
    size_number?: number;

    @Column({ allowNull: false })
    received_hours?: number;

    @Column({ allowNull: false })
    map?: string;

    @Column({ allowNull: false, type: DataType.DATEONLY })
    start_date?: Date;

    @Column({ allowNull: true, type: DataType.DATEONLY })
    end_date?: Date;

    @Column({ allowNull: false, defaultValue: false })
    is_open?: boolean;

    @Column({ })
    picture?: string;

    @Column({ })
    priority?: number;

    @Column({ defaultValue: 0, type: DataType.FLOAT })
    rating_point?: number;

    @HasMany(() => UserActivity, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        hooks: true
    })
    userActivities?: UserActivity[];

    @HasMany(() => Rating, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        hooks: true
    })
    ratings?: Rating[];

    @HasMany(() => File, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        hooks: true
    })
    files?: File[];

    @HasMany(() => Comment, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        hooks: true
    })
    comments?: Comment;

    @HasMany(() => Notification, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        hooks: true
      })
      notify?: Notification;

    // @HasMany(() => PdfFile, {
    //     onUpdate: "CASCADE",
    //     onDelete: "CASCADE",
    //     hooks: true
    // })
    // pdfFile?: Buffer;

    // @BelongsToMany(() => User, () => UserActivity)
    // users: User[];
}