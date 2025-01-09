import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import { pl } from "date-fns/locale";
import { IoArrowBack } from "react-icons/io5";

import "react-datepicker/dist/react-datepicker.css";
import styles from "./ReserveVisitDoctor.module.css";
import { useSupabase } from "../../contexts/SupabaseProvider";
import { IDoctor } from "../../types/IDoctor";
import IconButton from "../../components/IconButton/IconButton";
import { IPatient } from "../../types/IPatient";
import { IVisit } from "../../types/IVisit";

registerLocale("pl", pl);

const ReserveVisitDoctor: React.FC = () => {
    const supabase = useSupabase();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [doctor, setDoctor] = useState<IDoctor>();
    const [visits, setVisits] = useState<IVisit[]>();
    const doctorId = useLoaderData() as string;
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        const handleSearch = async () => {
            setLoading(true);
            try {
                const doctorRes = await supabase
                    .from("doctor")
                    .select("id, first_name, last_name, specialization, work_time")
                    .eq("id", doctorId)
                    .single();

                if (doctorRes.error) {
                    console.error("Blad podczas wyszukiwania:", doctorRes.error.message);
                } else {
                    setDoctor(doctorRes.data);
                }

                const visitsRes = await supabase
                    .from("visit")
                    .select("patient_id, doctor_id, date, confirmed")
                    .eq("doctor_id", doctorId);

                if (visitsRes.error) {
                    console.error("Blad podczas wyszukiwania:", visitsRes.error.message);
                } else {
                    setVisits(visitsRes.data);
                }
            } catch (err) {
                console.error("Nieoczekiwany blad:", err);
            } finally {
                setLoading(false);
            }
        };
        void handleSearch();
    }, [doctorId, supabase]);

    if (loading) {
        return <div className={styles.root}>Ładowanie...</div>;
    }
    if (!doctor) {
        return <div className={styles.root}>Błąd! Nie ma takiego lekarza!</div>;
    }
    if (!visits) {
        return <div className={styles.root}>Błąd! Brak wizyt!</div>;
    }

    const validateDate = (date: Date) => {
        return doctor.work_time.some(w => date.getDay() === w.day);
    };

    const validateDateTime = (date: Date | null) => {
        if (!(date instanceof Date)) return false;
        const hour = date.getHours();
        const minute = date.getMinutes();

        const isInWorkingHours = doctor.work_time.some(w =>
            date.getDay() === w.day && (
                (hour > w.starting_hour && hour < w.ending_hour)
                || (hour === w.starting_hour && minute >= w.starting_minute)
                || (hour === w.ending_hour && minute < w.ending_minute)
            ),
        );
        if (!isInWorkingHours) return false;

        return !visits.some(visit => date.valueOf() === new Date(visit.date).valueOf());
    };

    const reserveVisit = async () => {
        if (!validateDateTime(selectedDate)) {
            return;
        }

        const session = await supabase.auth.getSession();
        const patientRes = await supabase.from("patient")
            .select("id, email")
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .eq("email", session.data.session!.user.email)
            .single();

        const patient = patientRes.data as Partial<IPatient>;

        const res = await supabase.from("visit").insert({
            doctor_id: doctorId,
            patient_id: patient.id,
            date: selectedDate,
        });

        console.log(res);

        if (res.error) {
            // setErrorMessage(res.error.message);
            return;
        }

        navigate("/patient/reserve_visit", { state: "VISIT_RESERVED" });
    };

    return (
        <div className={styles.root}>
            <IconButton title="Cofnij" onClick={() => { navigate(-1); }}>
                <IoArrowBack size={24} />
            </IconButton>
            <h3>Rezerwacja wizyty</h3>
            <div>{doctor.first_name} {doctor.last_name}, {doctor.specialization}</div>
            <div>
                <DatePicker
                    showIcon
                    locale="pl"
                    showTimeSelect
                    dateFormat="Pp"
                    timeCaption="Godzina"
                    placeholderText="Wybierz termin"
                    popperPlacement="bottom-end"
                    selected={selectedDate}
                    minDate={new Date()}
                    filterDate={validateDate}
                    filterTime={validateDateTime}
                    onChange={(date) => { setSelectedDate(date); }}
                />
            </div>
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <button onClick={reserveVisit}>Umów wizytę</button>
        </div>
    );
};

export default ReserveVisitDoctor;
