import { useEffect, useState } from "react";
import clsx from "clsx/lite";

import { useSupabase } from "../../contexts/SupabaseProvider";
import styles from "./DoctorVisits.module.css";
import { IVisit } from "../../types/IVisit";
import { IDoctor } from "../../types/IDoctor";
import { IPatient } from "../../types/IPatient";

interface IData extends IVisit {
    patient: Pick<IPatient, "first_name" | "last_name" | "email" | "pesel">;
    doctor: Pick<IDoctor, "first_name" | "last_name" | "specialization">;
}

const DoctorVisits: React.FC = () => {
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
                        patient(first_name, last_name, pesel, email),
                        doctor(first_name, last_name, specialization)`)
                    .eq("doctor.email", userEmail)
                    .order("date");

                const data = visitsRes.data as IData[] | null;

                if (visitsRes.error) {
                    console.error("Database error:", visitsRes.error);
                    setError("Nie udało się pobrać danych lekarza.");
                } else if (!data) {
                    console.error("No data found for email:", userEmail);
                    setError("Nie znaleziono danych lekarza.");
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
            <h2>Wizyty</h2>
            {loading && <div>Ładowanie...</div>}
            {(!loading && visits.length === 0) && <p>Brak zaplanowanych wizyt.</p>}
            {(!loading && visits.length > 0) && (
                <div className={styles.list}>
                    <div className={clsx(styles.listHeadingRow, styles.listRow)}>
                        <div className={styles.listCol}>Termin</div>
                        <div className={styles.listCol}>Pacjent</div>
                        <div className={styles.listCol}>Email Pacjenta</div>
                        <div className={styles.listCol}>Pesel pacjenta</div>
                        <div className={styles.listCol}>Opcje</div>
                    </div>
                    {visits.map(({ id, date: dateStr, patient, confirmed }) => {
                        const date = new Date(dateStr);
                        return (
                            <div className={styles.listRow} key={id}>
                                <div className={styles.listCol}>{date.toLocaleString().slice(0, -3)}</div>
                                <div className={styles.listCol}>{`${patient.first_name} ${patient.last_name}`}</div>
                                <div className={styles.listCol}>{patient.email}</div>
                                <div className={styles.listCol}>{patient.pesel}</div>
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

export default DoctorVisits;
