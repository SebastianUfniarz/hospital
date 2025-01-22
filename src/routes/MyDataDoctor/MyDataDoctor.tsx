import { useEffect, useState } from "react";
import styles from "./MyDataDoctor.module.css";
import { useNavigate } from "react-router-dom";
import { format, setDay } from "date-fns";
import { pl } from "date-fns/locale";

import { useSupabase } from "../../contexts/SupabaseProvider";
import { IDoctor } from "../../types/IDoctor";

const formatTime = (hour: number, minute: number) => {
    const formattedHour = String(hour).padStart(2, "0");
    const formattedMinute = String(minute).padStart(2, "0");
    return `${formattedHour}:${formattedMinute}`;
};

interface Doctor extends IDoctor {
    birth_date: string;
    telephone: number;
    pesel: number;
    email: string;
}

const MyDataDoctor: React.FC = () => {
    const supabase = useSupabase();
    const [doctorData, setDoctorData] = useState<Doctor | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleChangePasswordClick = () => {
        navigate("/change_password");
    };

    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                setLoading(true);
                const { data: session } = await supabase.auth.getSession();
                console.log("Session data:", session);

                if (!session.session) {
                    setError("Nie znaleziono aktywnej sesji użytkownika.");
                    setLoading(false);
                    return;
                }

                const userEmail = session.session.user.email;
                console.log("User email:", userEmail);

                const res = await supabase
                    .from("doctor")
                    .select("*")
                    .eq("email", userEmail)
                    .maybeSingle();

                console.log(res);
                const data = res.data as Doctor | null;

                if (res.error) {
                    console.error("Database error:", res.error);
                    setError("Nie udało się pobrać danych pacjenta.");
                } else if (!data) {
                    console.error("No data found for email:", userEmail);
                    setError("Nie znaleziono danych pacjenta.");
                } else {
                    console.log("Patient data:", data);
                    setDoctorData(data);
                }
            } catch (error) {
                console.error("Unexpected error:", error);
                setError("Wystąpił błąd podczas ładowania danych.");
            } finally {
                setLoading(false);
            }
        };

        void fetchDoctorData();
    }, [supabase]);

    if (error) {
        return <div className={styles.root}>{error}</div>;
    }

    return (
        <div className={styles.root}>
            <h3>Moje dane</h3>
            {loading && <div>Ładowanie danych...</div>}
            {!loading && !doctorData && <div>Nie znaleziono danych pacjenta.</div>}
            {!loading && doctorData && (
                <div className={styles.dataContainer}>
                    <p><strong>Imię:</strong> {doctorData.first_name}</p>
                    <p><strong>Nazwisko:</strong> {doctorData.last_name}</p>
                    <p><strong>PESEL:</strong> {doctorData.pesel}</p>
                    <p><strong>Data urodzenia:</strong> {doctorData.birth_date}</p>
                    <p><strong>Numer telefonu:</strong> {doctorData.telephone}</p>
                    <p><strong>Email:</strong> {doctorData.email}</p>
                    <p><strong>Specializacja:</strong> {doctorData.specialization}</p>
                    <p><strong>Godziny pracy:</strong>
                        {doctorData.work_time.map((wt) => {
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
                    <button className={styles.btn} onClick={handleChangePasswordClick}>
                        Zmień haslo
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyDataDoctor;
