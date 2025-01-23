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
import { format, setDay } from "date-fns";

registerLocale("pl", pl);

const formatTime = (hour: number, minute: number) => {
    const formattedHour = String(hour).padStart(2, "0");
    const formattedMinute = String(minute).padStart(2, "0");
    return `${formattedHour}:${formattedMinute}`;
};

const validateDate = (doctor: IDoctor, date: Date) => {
    return doctor.work_time.some(w => date.getDay() === w.day);
};

const ReserveVisitDoctor: React.FC = () => {
    const supabase = useSupabase();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [doctor, setDoctor] = useState<IDoctor>();
    const [errorMessage, setErrorMessage] = useState<string>();
    const [visits, setVisits] = useState<IVisit[]>([]);
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
                    .select("id, patient_id, doctor_id, date, confirmed")
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

    const validateDateTime = (doctor: IDoctor, date: Date | null) => {
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (!validateDateTime(doctor!, selectedDate)) return;

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
            setErrorMessage(res.error.message);
            return;
        }

        navigate("/patient/my_visits", { state: "VISIT_RESERVED" });
    };

    return (
        <div className={styles.root}>
            <h2>Rezerwacja wizyty</h2>
            <IconButton title="Cofnij" chipVariant onClick={() => { navigate(-1); }}>
                <IoArrowBack size={24} />
                Cofnij
            </IconButton>
            {errorMessage && <p>{errorMessage}</p>}
            {loading && <p>Ładowanie...</p>}
            {!loading && !errorMessage && doctor && (
                <>
                    <p><b>Lekarz:</b> {doctor.first_name} {doctor.last_name}, {doctor.specialization}</p>
                    <p><b>Godziny pracy:</b>
                        {doctor.work_time.map((wt) => {
                            const day = format(setDay(new Date(), wt.day), "EEEE", { locale: pl });
                            const start = formatTime(wt.starting_hour, wt.starting_minute);
                            const end = formatTime(wt.ending_hour, wt.ending_minute);
                            return (
                                <div key={wt.day}>
                                    {start} - {end} − {day}
                                </div>
                            );
                        })}
                    </p>
                    <div>
                        <DatePicker
                            wrapperClassName={styles.datePicker}
                            showIcon
                            locale="pl"
                            showTimeSelect
                            dateFormat="Pp"
                            timeCaption="Godzina"
                            placeholderText="Wybierz termin"
                            popperPlacement="bottom-end"
                            selected={selectedDate}
                            minDate={new Date()}
                            filterDate={date => validateDate(doctor, date)}
                            filterTime={time => validateDateTime(doctor, time)}
                            onChange={(date) => { setSelectedDate(date); }}
                        />
                    </div>
                    <button
                        className={styles.btn}
                        onClick={() => { void reserveVisit(); }}
                    >
                        Umów wizytę
                    </button>
                </>
            )}
        </div>
    );
};

export default ReserveVisitDoctor;
