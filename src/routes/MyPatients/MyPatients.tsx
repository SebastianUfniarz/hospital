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

    const handlePatientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const patientId = Number(event.target.value);
        const patient = patients.find(p => p.id === patientId) ?? null;
        setSelectedPatient(patient);
        setFormData(prev => ({ ...prev, patient_id: patientId }));
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
                .insert([
                    {
                        ...formData,
                        patient_id: selectedPatient.id,
                        doctor_id: doctorId,
                    },
                ]);
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
        } catch (error) {
            console.error(error);
            setErrorMessage("Nie udało się dodać rekordu.");
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
                        <option value="" disabled>
                            Wybierz pacjenta
                        </option>
                        {patients.map(patient => (
                            <option key={patient.id} value={patient.id}>
                                {patient.first_name} {patient.last_name} (PESEL: {patient.pesel})
                            </option>
                        ))}
                    </select>

                    {selectedPatient && (
                        <div>
                            <div className={styles.patientDetails}>
                                <h3>Szczegóły pacjenta</h3>
                                <p><strong>Imię:</strong> {selectedPatient.first_name}</p>
                                <p><strong>Nazwisko:</strong> {selectedPatient.last_name}</p>
                                <p><strong>PESEL:</strong> {selectedPatient.pesel}</p>
                                <p><strong>Data urodzenia:</strong> {selectedPatient.birth_date}</p>
                                <p><strong>Telefon:</strong> {selectedPatient.telephone}</p>
                                <p><strong>Email:</strong> {selectedPatient.email}</p>
                            </div>

                            <form onSubmit={(e) => { void handleSubmit(e); }} className={styles.editHistoryForm}>
                                <h3>Dodaj nowy wpis do historii leczenia wybranego pacjenta</h3>
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
                                    Dodaj nowy wpis
                                </button>
                                <div className={styles.messageContainer}>
                                    {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
                                    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                                </div>
                            </form>

                        </div>
                    )}
                </>
            )}

        </div>
    );
};

export default MyPatients;
