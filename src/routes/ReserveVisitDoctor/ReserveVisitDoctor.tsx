import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import { pl } from "date-fns/locale";

import "react-datepicker/dist/react-datepicker.css";
import styles from "./ReserveVisitDoctor.module.css";
import { useSupabase } from "../../contexts/SupabaseProvider";
import { IDoctor } from "../../types/IDoctor";
import IconButton from "../../components/IconButton/IconButton";
import { IoArrowBack } from "react-icons/io5";

registerLocale("pl", pl);

const ReserveVisitDoctor: React.FC = () => {
    const supabase = useSupabase();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [doctor, setDoctor] = useState<IDoctor>();
    const doctorId = useLoaderData() as string;
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        const handleSearch = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("doctor")
                    .select("id, first_name, last_name, specialization, work_time")
                    .eq("id", doctorId);

                if (error) {
                    console.error("Blad podczas wyszukiwania:", error.message);
                } else {
                    setDoctor(data[0]);
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

    const validateDate = (date: Date) => {
        return doctor.work_time.some(w => date.getDay() === w.day);
    };

    const validateDateTime = (date: Date) => {
        const hour = date.getHours();
        const minute = date.getMinutes();

        return doctor.work_time.some(w =>
            date.getDay() === w.day && (
                (hour > w.starting_hour && hour < w.ending_hour)
                || (hour === w.starting_hour && minute >= w.starting_minute)
                || (hour === w.ending_hour && minute < w.ending_minute)
            ),
        );
    };

    const reserveVisit = async () => {
        if (!validateDateTime(selectedDate)) {
            return;
        }

        const res = await supabase.from("visit").insert({
            doctor_id: doctorId,
            patient_id: 4,
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
                    popperPlacement="bottom-end"
                    selected={selectedDate}
                    minDate={new Date()}
                    filterDate={validateDate}
                    filterTime={validateDateTime}
                    onChange={(date) => { setSelectedDate(date ?? new Date()); }}
                />
            </div>
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <button onClick={reserveVisit}>Umów wizytę</button>
        </div>
    );
};

export default ReserveVisitDoctor;
