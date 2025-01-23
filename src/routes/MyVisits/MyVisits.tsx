import { useEffect, useState } from "react";
import clsx from "clsx/lite";

import { useSupabase } from "../../contexts/SupabaseProvider";
import styles from "./MyVisits.module.css";
import { IVisit } from "../../types/IVisit";
import { IDoctor } from "../../types/IDoctor";
import { IPatient } from "../../types/IPatient";

interface IData extends IVisit {
    doctor: Pick<IDoctor, "first_name" | "last_name" | "specialization">;
    patient: Pick<IPatient, "email">;
}

const MyVisits: React.FC = () => {
    const supabase = useSupabase();
    const [visits, setVisits] = useState<IData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);

    const cancelVisit = async (id: number) => {
        const res = await supabase
            .from("visit")
            .delete()
            .eq("id", id);

        if (res.error) {
            console.error("Database error:", res.error);
            setError("Nie udało się anulować wizyty!");
        } else {
            console.log(res);
            setReload(true);
        }
    };

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                setLoading(true);
                const { data: session } = await supabase.auth.getSession();

                if (!session.session) {
                    setError("Nie znaleziono aktywnej sesji użytkownika.");
                    setLoading(false);
                    return;
                }

                const userEmail = session.session.user.email;

                const visitsRes = await supabase
                    .from("visit")
                    .select(`
                        id, patient_id, doctor_id, date, confirmed,
                        patient(email),
                        doctor(first_name, last_name, specialization)`)
                    .eq("patient.email", userEmail)
                    .order("date");

                const data = visitsRes.data as IData[] | null;

                if (visitsRes.error) {
                    console.error("Database error:", visitsRes.error);
                    setError("Nie udało się pobrać danych pacjenta.");
                } else if (!data) {
                    console.error("No data found for email:", userEmail);
                    setError("Nie znaleziono danych pacjenta.");
                } else {
                    setVisits(data);
                }
            } catch (error) {
                console.error("Unexpected error:", error);
                setError("Wystąpił błąd podczas ładowania danych.");
            } finally {
                setLoading(false);
            }
        };

        void fetchVisits();
    }, [supabase, reload]);

    if (error) {
        return <div className={styles.root}>{error}</div>;
    }

    return (
        <div className={styles.root}>
            <h2>Moje wizyty</h2>
            {loading && <div>Ładowanie...</div>}
            {(!loading && visits.length === 0) && <p>Brak umówionych wizyt.</p>}
            {(!loading && visits.length > 0) && (
                <div className={styles.list}>
                    <div className={clsx(styles.listHeadingRow, styles.listRow)}>
                        <div className={styles.listCol}>Termin</div>
                        <div className={styles.listCol}>Imię</div>
                        <div className={styles.listCol}>Nazwisko</div>
                        <div className={styles.listCol}>Specjalizacja</div>
                        <div className={styles.listCol}>Zatwierdzona</div>
                        <div className={styles.listCol}>Opcje</div>
                    </div>
                    {visits.map(({ id, date: dateStr, doctor, confirmed }) => {
                        const date = new Date(dateStr);
                        return (
                            <div className={styles.listRow} key={id}>
                                <div className={styles.listCol}>{date.toLocaleString().slice(0, -3)}</div>
                                <div className={styles.listCol}>{doctor.first_name}</div>
                                <div className={styles.listCol}>{doctor.last_name}</div>
                                <div className={styles.listCol}>{doctor.specialization}</div>
                                <div className={styles.listCol}>{confirmed ? "Tak" : "Nie"}</div>
                                <div className={styles.listCol}>
                                    <button
                                        className={styles.btn}
                                        onClick={() => { void cancelVisit(id); }}
                                    >
                                        Anuluj wizytę
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyVisits;
