// import { BelongsTo, Column, DataType, ForeignKey, Model, Table, BelongsToMany } from "sequelize-typescript";
// import { Activity } from "./activity.entity";
// import { User } from "src/users/entities/user.entity";

// export interface pdfAttributes {
//     pdfFile: Buffer;
//     activityId?: number;
//     activities: Activity;
// }

// @Table({ tableName: "pdf_files", timestamps: true })
// export class PdfFile extends Model<pdfAttributes, pdfAttributes> implements pdfAttributes {

//     @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
//     id?: number;

//     @Column(DataType.BLOB)
//     pdfFile: Buffer;

//     @ForeignKey(() => Activity)
//     @Column
//     activityId?: number;

//     @BelongsTo(() => Activity, {
//         onUpdate: "CASCADE",
//         onDelete: "CASCADE",
//         hooks: true
//     })
//     activities: Activity;
// }
