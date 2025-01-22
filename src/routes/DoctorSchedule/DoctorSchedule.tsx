import { useEffect, useState } from "react";
import { addMinutes, format } from "date-fns";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createViewDay, createViewMonthAgenda, createViewMonthGrid, createViewWeek } from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";

import "@schedule-x/theme-default/dist/index.css";
import styles from "./DoctorSchedule.module.css";
import { useSupabase } from "../../contexts/SupabaseProvider";
import { IDoctor } from "../../types/IDoctor";
import { IVisit } from "../../types/IVisit";
import { IPatient } from "../../types/IPatient";

interface IVisitData extends IVisit {
    patient: Pick<IPatient, "first_name" | "last_name">;
}

const DoctorSchedule: React.FC = () => {
    const supabase = useSupabase();
    const [loading, setLoading] = useState(false);

    const eventsService = useState(() => createEventsServicePlugin())[0];

    const calendar = useCalendarApp({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
        plugins: [eventsService],
        locale: "pl-PL",
        dayBoundaries: {
            start: "08:00",
            end: "20:00",
        },
        weekOptions: {
            gridHeight: 900,
        },
    });

    useEffect(() => {
        const handleSearch = async () => {
            setLoading(true);
            try {
                const session = await supabase.auth.getSession();
                const doctorRes = await supabase.from("doctor")
                    .select("id, email")
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    .eq("email", session.data.session!.user.email)
                    .single();

                const doctor = doctorRes.data as Pick<IDoctor, "id">;

                const visitsRes = await supabase
                    .from("visit")
                    .select(`
                        id, patient_id, doctor_id, date, confirmed,
                        patient(first_name, last_name)`)
                    .eq("doctor_id", doctor.id);

                if (visitsRes.error) {
                    console.error("Blad podczas wyszukiwania:", visitsRes.error.message);
                } else {
                    const visits = visitsRes.data as unknown as IVisitData[];

                    eventsService.set(visits.map((visit) => {
                        const startDate = new Date(visit.date);
                        const endDate = addMinutes(startDate, 30);
                        return {
                            id: visit.id,
                            title: `${visit.patient.first_name} ${visit.patient.last_name}`,
                            start: format(startDate, "yyyy-MM-dd HH:mm"),
                            end: format(endDate, "yyyy-MM-dd HH:mm"),
                        };
                    }));
                }
            } catch (err) {
                console.error("Nieoczekiwany blad:", err);
            } finally {
                setLoading(false);
            }
        };
        void handleSearch();
    }, [supabase, eventsService]);

    return (
        <div className={styles.root}>
            <h2>Mój harmonogram</h2>
            {loading && <div>Ładowanie...</div>}
            {!loading && (
                <div className={styles.calendarWrapper}>
                    <ScheduleXCalendar calendarApp={calendar} />
                </div>
            )}
        </div>
    );
};

export default DoctorSchedule;
