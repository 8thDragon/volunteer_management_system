export class CreateUserActivityDto {
    userActivityName?: string;
    userId?: number;
    userIdConfirmed?: number;
    activityId?: number;
    date?: Date;
    is_ended?: boolean;
}
