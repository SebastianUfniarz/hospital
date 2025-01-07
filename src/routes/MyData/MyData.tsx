import { useEffect, useState } from "react";
import styles from "./MyData.module.css";
import { useSupabase } from "../../contexts/SupabaseProvider";
import { useNavigate } from "react-router-dom";
import { IPatient } from "../../types/IPatient";

const MyData: React.FC = () => {
    const supabase = useSupabase();
    const [patientData, setPatientData] = useState<IPatient | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleChangePasswordClick = () => {
        navigate("/change_password");
    };

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
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
                    .from("patient")
                    .select("*")
                    .eq("email", userEmail)
                    .maybeSingle();

                console.log(res);
                const data = res.data as IPatient | null;

                if (res.error) {
                    console.error("Database error:", res.error);
                    setError("Nie udało się pobrać danych pacjenta.");
                } else if (!data) {
                    console.error("No data found for email:", userEmail);
                    setError("Nie znaleziono danych pacjenta.");
                } else {
                    console.log("Patient data:", data);
                    setPatientData(data);
                }
            } catch (error) {
                console.error("Unexpected error:", error);
                setError("Wystąpił błąd podczas ładowania danych.");
            } finally {
                setLoading(false);
            }
        };

        void fetchPatientData();
    }, [supabase]);

    if (loading) {
        return <div className={styles.root}>Ładowanie danych...</div>;
    }

    if (error) {
        return <div className={styles.root}>{error}</div>;
    }

    return (
        <div className={styles.root}>
            <h1>Moje dane</h1>
            {patientData
                ? (
                        <div className={styles.dataContainer}>
                            <p><strong>Imie:</strong> {patientData.first_name}</p>
                            <p><strong>Nazwisko:</strong> {patientData.last_name}</p>
                            <p><strong>PESEL:</strong> {patientData.pesel}</p>
                            <p><strong>Data urodzenia:</strong> {patientData.birth_date}</p>
                            <p><strong>Numer telefonu:</strong> {patientData.telephone}</p>
                            <p><strong>Email:</strong> {patientData.email}</p>

                            <button className={styles.btn} onClick={handleChangePasswordClick}>
                                Zmien haslo
                            </button>
                        </div>
                    )
                : (
                        <p>Nie znaleziono danych pacjenta.</p>
                    )}
        </div>
    );
};

export default MyData;
