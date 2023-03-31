export class CreateUserActivityDto {
    id?: number
    userActivityName?: string;
    userId?: number;
    userIdConfirmed?: number;
    activityId?: number;
    date?: Date;
    is_ended?: boolean;
}
