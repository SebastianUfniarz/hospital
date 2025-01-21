import React, { useEffect, useState } from "react";
import { useSupabase } from "../../contexts/SupabaseProvider";
import styles from "./MyPatients.module.css";
import { IPatient } from "../../types/IPatient";
import { IPatientRecord } from "../../types/IPatientRecord";

const MyPatients: React.FC = () => {
    const supabase = useSupabase();
    const [patients, setPatients] = useState<IPatient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);
    const [doctorId, setDoctorId] = useState<number | null>(null);
    const [formData, setFormData] = useState<Partial<IPatientRecord>>({
        diagnosis: "",
        recommendations: "",
        performed_treatments: "",
        diagnosis_date: "",
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"addRecord" | "viewHistory">("addRecord");
    const [patientHistory, setPatientHistory] = useState<IPatientRecord[]>([]);

    const [editingRecordId, setEditingRecordId] = useState<number | null>(null);
    const [editingRecord, setEditingRecord] = useState<Partial<IPatientRecord>>({});

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const { data: patientsData, error: patientsError } = await supabase
                    .from("patient")
                    .select("*");
                if (patientsError) throw patientsError;
                setPatients(patientsData);

                const session = await supabase.auth.getSession();
                const { data: doctorData, error: doctorError } = await supabase
                    .from("doctor")
                    .select("id")
                    .eq("email", session.data.session?.user.email)
                    .single();
                if (doctorError) throw doctorError;

                setDoctorId(doctorData.id as number);
            } catch (error) {
                console.error(error);
                setErrorMessage("Nie udało się załadować danych");
            } finally {
                setLoading(false);
            }
        };

        void fetchInitialData();
    }, [supabase]);

    const handlePatientChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const patientId = Number(event.target.value);
        const patient = patients.find(p => p.id === patientId) ?? null;
        setSelectedPatient(patient);
        setFormData(prev => ({ ...prev, patient_id: patientId }));

        if (patient) {
            try {
                const { data: historyData, error: historyError } = await supabase
                    .from("patient_record")
                    .select("*")
                    .eq("patient_id", patientId);
                if (historyError) throw historyError;
                setPatientHistory(historyData);
            } catch (error) {
                console.error(error);
                setErrorMessage("Nie udało się załadować historii leczenia.");
            }
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSuccessMessage(null);
        setErrorMessage(null);

        if (!selectedPatient || !doctorId) {
            setErrorMessage("Wybierz pacjenta i upewnij się, że jesteś zalogowany jako lekarz.");
            return;
        }

        try {
            const { error: recordError } = await supabase
                .from("patient_record")
                .insert([{
                    ...formData,
                    patient_id: selectedPatient.id,
                    doctor_id: doctorId,
                }]);
            if (recordError) throw recordError;

            setSuccessMessage("Rekord historii leczenia został dodany.");
            setFormData({
                diagnosis: "",
                recommendations: "",
                performed_treatments: "",
                diagnosis_date: "",
                patient_id: undefined,
                doctor_id: undefined,
            });

            await handlePatientChange({
                target: { value: selectedPatient.id.toString() },
            } as React.ChangeEvent<HTMLSelectElement>);
        } catch (error) {
            console.error(error);
            setErrorMessage("Nie udało się dodać rekordu.");
        }
    };

    const startEditing = (record: IPatientRecord) => {
        setEditingRecordId(record.id);
        setEditingRecord(record);
    };

    const cancelEditing = () => {
        setEditingRecordId(null);
        setEditingRecord({});
    };

    const handleEditInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setEditingRecord(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveEdit = async (recordId: number) => {
        try {
            const { error: updateError } = await supabase
                .from("patient_record")
                .update({
                    diagnosis: editingRecord.diagnosis,
                    recommendations: editingRecord.recommendations,
                    performed_treatments: editingRecord.performed_treatments,
                    diagnosis_date: editingRecord.diagnosis_date,
                })
                .eq("id", recordId);

            if (updateError) {
                console.error("Błąd przy aktualizacji:", updateError);
                throw updateError;
            }

            setSuccessMessage("Rekord został zaktualizowany.");
            setPatientHistory(prevHistory =>
                prevHistory.map(record =>
                    record.id === recordId ? { ...record, ...editingRecord } : record
                )
            );

            setEditingRecordId(null);
            setEditingRecord({});
        } catch (error) {
            setErrorMessage("Nie udało się zaktualizować rekordu.");
        }
    };

    return (
        <div className={styles.root}>
            <h3>Dodaj historię leczenia pacjenta</h3>
            {loading && <p>Ładowanie...</p>}
            {!loading && !errorMessage && (
                <>
                    <label htmlFor="patientSelect">Wybierz pacjenta:</label>
                    <select
                        id="patientSelect"
                        onChange={handlePatientChange}
                        defaultValue=""
                        className={styles.patientSelect}
                    >
                        <option value="" disabled>Wybierz pacjenta</option>
                        {patients.map(patient => (
                            <option key={patient.id} value={patient.id}>
                                {patient.first_name} {patient.last_name} (PESEL: {patient.pesel})
                            </option>
                        ))}
                    </select>

                    {selectedPatient && (
                        <div className={styles.empty}>
                            <div className={styles.patientDetails}>
                                <h3>Szczegóły pacjenta</h3>
                                <p><strong>Imię:</strong> {selectedPatient.first_name}</p>
                                <p><strong>Nazwisko:</strong> {selectedPatient.last_name}</p>
                                <p><strong>PESEL:</strong> {selectedPatient.pesel}</p>
                                <p><strong>Data urodzenia:</strong> {selectedPatient.birth_date}</p>
                                <p><strong>Telefon:</strong> {selectedPatient.telephone}</p>
                                <p><strong>Email:</strong> {selectedPatient.email}</p>
                                <div className={styles.viewToggle}>
                                    <button
                                        onClick={() => setViewMode("addRecord")}
                                        className={`${styles.submitButton} ${viewMode === "addRecord" ? styles.activeButton : ""}`}
                                    >
                                        Dodaj nowy wpis
                                    </button>
                                    <button
                                        onClick={() => setViewMode("viewHistory")}
                                        className={`${styles.submitButton} ${viewMode === "viewHistory" ? styles.activeButton : ""}`}
                                    >
                                        Pokaż historię
                                    </button>
                                </div>
                            </div>

                            {viewMode === "addRecord" && (
                                <form onSubmit={(e) => { void handleSubmit(e); }} className={styles.editHistoryForm}>
                                    <h3>Dodaj nowy wpis do historii leczenia</h3>
                                    <label>
                                        Diagnoza:
                                        <textarea
                                            name="diagnosis"
                                            value={formData.diagnosis ?? ""}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Rekomendacje:
                                        <textarea
                                            name="recommendations"
                                            value={formData.recommendations ?? ""}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Przeprowadzone zabiegi:
                                        <textarea
                                            name="performed_treatments"
                                            value={formData.performed_treatments ?? ""}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Data diagnozy:
                                        <input
                                            type="date"
                                            name="diagnosis_date"
                                            value={formData.diagnosis_date ?? ""}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </label>
                                    <button type="submit" className={styles.submitButton}>
                                        Dodaj wpis
                                    </button>
                                    {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
                                    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                                </form>
                            )}

                            {viewMode === "viewHistory" && (
                                <div className={styles.editHistoryForm}>
                                    <h3>Historia leczenia</h3>
                                    {patientHistory.length > 0 ? (
                                        patientHistory.map((record) => (
                                            <div key={record.id} className={styles.editHistoryForm}>                                                
                                                <table className={styles.historyTable}>
                                                    <thead>
                                                        <tr>
                                                            <th>Diagnoza</th>
                                                            <th>Rekomendacje</th>
                                                            <th>Zabiegi</th>
                                                            <th>Data diagnozy</th>
                                                            <th>Akcje</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            {editingRecordId === record.id ? (
                                                                <>
                                                                    <td>
                                                                        <textarea
                                                                            value={editingRecord.diagnosis || ""}
                                                                            name="diagnosis"
                                                                            onChange={handleEditInputChange}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <textarea
                                                                            value={editingRecord.recommendations || ""}
                                                                            name="recommendations"
                                                                            onChange={handleEditInputChange}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <textarea
                                                                            value={editingRecord.performed_treatments || ""}
                                                                            name="performed_treatments"
                                                                            onChange={handleEditInputChange}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            type="date"
                                                                            value={editingRecord.diagnosis_date || ""}
                                                                            name="diagnosis_date"
                                                                            onChange={handleEditInputChange}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <button onClick={() => handleSaveEdit(record.id)} className={styles.submitButton}>
                                                                            Zapisz
                                                                        </button>
                                                                        <button onClick={cancelEditing} className={styles.submitButton}>
                                                                            Anuluj
                                                                        </button>
                                                                    </td>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <td>{record.diagnosis}</td>
                                                                    <td>{record.recommendations}</td>
                                                                    <td>{record.performed_treatments}</td>
                                                                    <td>{record.diagnosis_date}</td>
                                                                    <td>
                                                                        <button className={styles.submitButton}
                                                                            onClick={() => startEditing(record)}
                                                                        >
                                                                            Edytuj
                                                                        </button>
                                                                    </td>
                                                                </>
                                                            )}
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Brak historii leczenia dla tego pacjenta.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyPatients;
