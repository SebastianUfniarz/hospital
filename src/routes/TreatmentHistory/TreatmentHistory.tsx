import { useEffect, useState } from "react";
import { useSupabase } from "../../contexts/SupabaseProvider";
import styles from "./TreatmentHistory.module.css";
import { IPatientRecord } from "../../types/IPatientRecord";
import { IPatient } from "../../types/IPatient";
import { IDoctor } from "../../types/IDoctor";

interface IPatientRecordData extends IPatientRecord {
    patient: Pick<IPatient, "id">;
    doctor: Pick<IDoctor, "first_name" | "last_name" | "specialization">;
}

const TreatmentHistory: React.FC = () => {
    const supabase = useSupabase();
    const [history, setHistory] = useState<IPatientRecordData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchTreatmentHistory = async () => {
            try {
                const session = await supabase.auth.getSession();
                const patientRes = await supabase.from("patient")
                    .select("id, email")
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    .eq("email", session.data.session!.user.email)
                    .single();

                const patientRecordsRes = await supabase
                    .from("patient_record")
                    .select(`
                        id, diagnosis, recommendations, performed_treatments, diagnosis_date, patient_id, doctor_id,
                        patient(id),
                        doctor(first_name, last_name, specialization)`)
                    .eq("patient.id", patientRes.data?.id)
                    .order("diagnosis_date");

                const patientRecords = patientRecordsRes.data as unknown as IPatientRecordData[];

                if (patientRecordsRes.error) throw patientRecordsRes.error;

                setHistory(patientRecords);
            } catch (error) {
                console.error(error);
                setErrorMessage("Nie udało się pobrać historii leczenia");
            } finally {
                setLoading(false);
            }
        };
        void fetchTreatmentHistory();
    }, [supabase]);

    return (
        <div className={styles.root}>
            <h2>Historia Leczenia</h2>
            {loading && <div>Ładowanie...</div>}
            {errorMessage && <div>{errorMessage}</div>}
            {!loading && !errorMessage && history.length === 0 && <div>Brak danych</div>}
            {!loading && !errorMessage && history.length !== 0 && (
                <table className={styles.historyTable}>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Lekarz</th>
                            <th>Specializacja</th>
                            <th>Diagnoza</th>
                            <th>Wykonane zabiegi</th>
                            <th>Zalecenia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map(record => (
                            <tr key={record.id}>
                                <td>{record.diagnosis_date}</td>
                                <td>{record.doctor.first_name} {record.doctor.last_name}</td>
                                <td>{record.doctor.specialization}</td>
                                <td>{record.diagnosis}</td>
                                <td>{record.performed_treatments ?? "-"}</td>
                                <td>{record.recommendations ?? "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </div>
    );
};
export default TreatmentHistory;
