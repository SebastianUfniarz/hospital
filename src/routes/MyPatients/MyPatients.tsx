import React, { useEffect, useState } from "react";
import { useSupabase } from "../../contexts/SupabaseProvider";
import styles from "./MyPatients.module.css";

const MyPatients: React.FC = () => {
  const supabase = useSupabase();
  const [patients, setPatients] = useState<any[]>([]); 
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null); 
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  
  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase.from("patient").select("*");
      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      setErrorMessage("Nie udało się pobrać pacjentów");
    } finally {
      setLoading(false);
    }
  };

  
  const handlePatientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const patientId = Number(event.target.value);
    const patient = patients.find((p) => p.id === patientId) || null;
    setSelectedPatient(patient);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className={styles.root}>
      <h2>Wybierz pacjenta</h2>
      {loading ? (
        <p>Ładowanie...</p>
      ) : errorMessage ? (
        <p style={{ color: "red" }}>{errorMessage}</p>
      ) : (
        <>          
          <select
            onChange={handlePatientChange}
            defaultValue=""
            className={styles.patientSelect}
          >
            <option value="" disabled>
              Wybierz pacjenta
            </option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.first_name} {patient.last_name} (PESEL: {patient.pesel})
              </option>
            ))}
          </select>
          
          {selectedPatient && (
            <div className={styles.patientDetails}>
              <h3>Szczegóły pacjenta</h3>
              <p>
                <strong>Imię:</strong> {selectedPatient.first_name}
              </p>
              <p>
                <strong>Nazwisko:</strong> {selectedPatient.last_name}
              </p>
              <p>
                <strong>PESEL:</strong> {selectedPatient.pesel}
              </p>
              <p>
                <strong>Data urodzenia:</strong> {selectedPatient.birth_date}
              </p>
              <p>
                <strong>Telefon:</strong> {selectedPatient.telephone}
              </p>
              <p>
                <strong>Email:</strong> {selectedPatient.email}
              </p>
              <button
                className={styles.editHistoryButton}
                onClick={() => alert("Edycja historii leczenia")}
              >
                Edytuj historię leczenia
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyPatients;
