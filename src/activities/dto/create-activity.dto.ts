export class CreateActivityDto {
    id?:number;
    activity_name?: string;
    activity_details?: string;
    size_number?: number;
    received_hours?: number;
    map?: string;
    picture?: string;
    priority?: number;
}