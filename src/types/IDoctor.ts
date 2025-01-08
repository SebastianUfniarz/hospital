export interface IDoctor {
    id: number;
    first_name: string;
    last_name: string;
    specialization: string;
    work_time: [{
        day: number;
        ending_hour: number;
        ending_minute: number;
        starting_hour: number;
        starting_minute: number;
    }];
}
