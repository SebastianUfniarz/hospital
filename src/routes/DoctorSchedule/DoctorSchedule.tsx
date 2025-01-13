import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addMinutes } from "date-fns";
import { pl } from "date-fns/locale";

import styles from "./DoctorSchedule.module.css";
import "./react-big-calendar.css";
import { useSupabase } from "../../contexts/SupabaseProvider";
import { IDoctor } from "../../types/IDoctor";
import { IVisit } from "../../types/IVisit";
import { IPatient } from "../../types/IPatient";

const messages = {
    next: "Następny",
    previous: "Poprzedni",
    today: "Dziś",
    month: "Miesiąc",
    week: "Tydzień",
    day: "Dzień",
    allDay: "Cały dzień",
    noEventsInRange: "Brak wydarzeń w tym zakresie",
};

const locales = { "pl": pl };

interface IEventItem {
    title: string;
    start: Date;
    end: Date;
}

interface IVisitData extends IVisit {
    patient: Pick<IPatient, "first_name" | "last_name">;
}

const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const DoctorSchedule: React.FC = () => {
    const supabase = useSupabase();
    const [loading, setLoading] = useState(false);

    const [events, setEvents] = useState<IEventItem[]>([]);

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

                    setEvents(visits.map((visit) => {
                        const startDate = new Date(visit.date);
                        const endDate = addMinutes(startDate, 30);
                        return {
                            title: `${visit.patient.first_name} ${visit.patient.last_name}`,
                            start: startDate,
                            end: endDate,
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
    }, [supabase]);

    if (loading) {
        return <div className={styles.root}>Ładowanie...</div>;
    }

    return (
        <div className={styles.root}>
            <h3>Mój harmonogram</h3>
            <Calendar
                localizer={localizer}
                culture="pl"
                messages={messages}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 512 }}
            />
        </div>
    );
};

export default DoctorSchedule;
