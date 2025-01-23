import { useEffect, useState } from "react";
import clsx from "clsx/lite";

import { useSupabase } from "../../contexts/SupabaseProvider";
import styles from "./DoctorVisits.module.css";
import { IVisit } from "../../types/IVisit";
import { IPatient } from "../../types/IPatient";
import { IDoctor } from "../../types/IDoctor";

interface IData extends IVisit {
    patient: Pick<IPatient, "first_name" | "last_name" | "email" | "pesel">;
    doctor: Pick<IDoctor, "first_name" | "last_name" | "specialization">;
}

const DoctorVisits: React.FC = () => {
    const supabase = useSupabase();
    const [visits, setVisits] = useState<IData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<{ [key: number]: boolean }>({});
    const [reload, setReload] = useState(false);

    const cancelVisit = async (id: number) => {
        const confirmAction = window.confirm("Czy na pewno chcesz anulować tę wizytę?");
        if (!confirmAction) return;

        try {
            setActionLoading((prev) => ({ ...prev, [id]: true }));
            const res = await supabase
                .from("visit")
                .delete()
                .eq("id", id)
                .select();

            if (res.error) {
                setError("Nie udało się anulować wizyty!");
            } else if (res.data && res.data.length > 0) {
                setReload((prev) => !prev);
                alert("Wizyta została pomyślnie anulowana.");
            } else {
                setError("Wizyta nie została znaleziona lub już anulowana.");
            }
        } catch {
            setError("Wystąpił błąd podczas anulowania wizyty.");
        } finally {
            setActionLoading((prev) => ({ ...prev, [id]: false }));
        }
    };

    const confirmVisit = async (id: number) => {
        const confirmAction = window.confirm("Czy na pewno chcesz potwierdzić tę wizytę?");
        if (!confirmAction) return;

        try {
            setActionLoading((prev) => ({ ...prev, [id]: true }));
            const res = await supabase
                .from("visit")
                .update({ confirmed: true })
                .eq("id", id)
                .select();

            if (res.error) {
                setError("Nie udało się potwierdzić wizyty!");
            } else if (res.data && res.data.length > 0) {
                setReload((prev) => !prev);
                alert("Wizyta została pomyślnie potwierdzona.");
            } else {
                setError("Wizyta nie została znaleziona.");
            }
        } catch {
            setError("Wystąpił błąd podczas potwierdzania wizyty.");
        } finally {
            setActionLoading((prev) => ({ ...prev, [id]: false }));
        }
    };

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                setLoading(true);
                const { data: session } = await supabase.auth.getSession();

                if (!session.session) {
                    setError("Nie znaleziono aktywnej sesji użytkownika.");
                    return;
                }

                const userEmail = session.session.user.email;

                const visitsRes = await supabase
                    .from("visit")
                    .select(`
                        id, patient_id, doctor_id, date, confirmed,
                        patient(first_name, last_name, email, pesel),
                        doctor(first_name, last_name, specialization)`)
                    .eq("doctor.email", userEmail)
                    .order("date", { ascending: true });

                if (visitsRes.error) {
                    setError("Nie udało się pobrać danych lekarza.");
                } else if (!visitsRes.data || visitsRes.data.length === 0) {
                    setError("Nie znaleziono żadnych wizyt.");
                } else {
                    setVisits(visitsRes.data as unknown as IData[]);
                }
            } catch {
                setError("Wystąpił błąd podczas ładowania danych.");
            } finally {
                setLoading(false);
            }
        };

        fetchVisits();
    }, [supabase, reload]);

    if (error) {
        return <div className={styles.root}>{error}</div>;
    }

    return (
        <div className={styles.root}>
            <h2>Wizyty</h2>
            {loading && <div>Ładowanie...</div>}
            {!loading && visits.length === 0 && <p>Brak zaplanowanych wizyt.</p>}
            {!loading && visits.length > 0 && (
                <div className={styles.list}>
                    <div className={clsx(styles.listHeadingRow, styles.listRow)}>
                        <div className={styles.listCol}>Termin</div>
                        <div className={styles.listCol}>Pacjent</div>
                        <div className={styles.listCol}>Email Pacjenta</div>
                        <div className={styles.listCol}>PESEL Pacjenta</div>
                        <div className={styles.listCol}>Potwierdzenie</div>
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
                                    {confirmed ? "Potwierdzona" : "Niepotwierdzona"}
                                </div>
                                <div className={styles.listCol}>
                                    {!confirmed && (
                                        <>
                                            <button
                                                className={styles.btnConfirm}
                                                onClick={() => confirmVisit(id)}
                                                disabled={actionLoading[id]}
                                            >
                                                {actionLoading[id] ? "Potwierdzanie..." : "Potwierdź wizytę"}
                                            </button>
                                            <button
                                                className={styles.btnCancel}
                                                onClick={() => cancelVisit(id)}
                                                disabled={actionLoading[id]}
                                            >
                                                {actionLoading[id] ? "Anulowanie..." : "Anuluj wizytę"}
                                            </button>
                                        </>
                                    )}
                                    {confirmed && (
                                        <span className={styles.confirmedLabel}>Zatwierdzona</span>
                                    )}
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
