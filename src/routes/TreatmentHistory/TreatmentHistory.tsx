import { useEffect, useState } from "react";
import { useSupabase } from "../../contexts/SupabaseProvider";
import styles from "./TreatmentHistory.module.css";
import { IPatientRecord } from "../../types/IPatientRecord";

const TreatmentHistory: React.FC = () => {
    const supabase = useSupabase();
    const [history, setHistory] = useState<IPatientRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchTreatmentHistory = async () => {
            try {
                const { data: patientRecords, error: patientRecordsError } = await supabase
                    .from("patient_record")
                    .select("id, diagnosis, diagnosis_date, patient_id, doctor_id")
                    .eq("doctor_id", 21);

                if (patientRecordsError) throw patientRecordsError;

                const recordsWithDetails = await Promise.all(
                    patientRecords.map(async (record) => {
                        interface INames {
                            first_name: string;
                            last_name: string;
                        }

                        const res1 = await supabase
                            .from("patient")
                            .select("first_name, last_name")
                            .eq("id", record.patient_id)
                            .single();
                        const patientData = res1.data as INames;

                        const res2 = await supabase
                            .from("doctor")
                            .select("first_name, last_name")
                            .eq("id", record.doctor_id)
                            .single();
                        const doctorData = res2.data as INames;

                        return {
                            ...record,
                            patient_name: `${patientData.first_name} ${patientData.last_name}`,
                            doctor_name: `${doctorData.first_name} ${doctorData.last_name}`,
                        };
                    }),
                );

                setHistory(recordsWithDetails);
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
            <h3>Historia Leczenia</h3>
            {loading
                ? (
                        <p>Ładowanie...</p>
                    )
                : errorMessage
                    ? (
                            <p style={{ color: "red" }}>{errorMessage}</p>
                        )
                    : (
                            <table className={styles.historyTable}>
                                <thead>
                                    <tr>
                                        <th>Pacjent</th>
                                        <th>Doktor</th>
                                        <th>Diagnoza</th>
                                        <th>Data diagnozy</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map(record => (
                                        <tr key={record.id}>
                                            <td>{record.patient_name}</td>
                                            <td>{record.doctor_name}</td>
                                            <td>{record.diagnosis}</td>
                                            <td>{record.diagnosis_date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
        </div>
    );
};

export default TreatmentHistory;
