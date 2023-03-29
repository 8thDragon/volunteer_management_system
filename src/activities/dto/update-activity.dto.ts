export class UpdateActivityDto {
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
}