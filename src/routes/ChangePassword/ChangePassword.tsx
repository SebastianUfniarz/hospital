import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoWarning } from "react-icons/io5";
import { useSupabase } from "../../contexts/SupabaseProvider";

import styles from "./ChangePassword.module.css";

const ChangePassword: React.FC = () => {
    // const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { auth } = useSupabase();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setErrorMessage("Nowe hasla sie nie zgadzaja.");
            return;
        }

        setLoading(true);

        const { error } = await auth.updateUser({
            password: newPassword,
        });

        if (error) {
            setErrorMessage(error.message);
            setLoading(false);
            return;
        }

        navigate("/patient/my_data", { state: { message: "Haslo zostalo zmienione." } });
    };

    return (
        <div className={styles.root}>
            <div className={styles.container}>

                <div className={styles.heading}>Zmiana hasla</div>
                <form onSubmit={(e) => { void handleSubmit(e); }}>
                    <div className={styles.formGroup}>
                        {/* <label htmlFor="newPassword">Nowe haslo:</label> */}
                        <input
                            type="password"
                            id="newPassword"
                            placeholder="Nowe haslo"
                            value={newPassword}
                            className={styles.textInput}
                            onChange={(e) => { setNewPassword(e.target.value); }}
                            required
                            minLength={6}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        {/* <label htmlFor="confirmPassword">Potwierdz nowe haslo:</label> */}
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Potwierdz nowe haslo"
                            value={confirmPassword}
                            className={styles.textInput}
                            onChange={(e) => { setConfirmPassword(e.target.value); }}
                            required
                            minLength={6}
                        />
                    </div>

                    {errorMessage && (
                        <div className={styles.errorMessage}>
                            <IoWarning size={22} />
                            {errorMessage}
                        </div>
                    )}

                    <button type="submit" className={styles.btn} disabled={loading}>
                        {loading ? "Zmiana..." : "Zmien haslo"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
