import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoWarning } from "react-icons/io5";

import styles from "./Login.module.css";
import { useSupabase } from "../../contexts/SupabaseProvider";

interface FormTarget extends EventTarget {
    email: HTMLInputElement;
    password: HTMLInputElement;
}

const Login: React.FC = () => {
    const supabase = useSupabase();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string>();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const email = (e.target as FormTarget).email.value;
        const password = (e.target as FormTarget).password.value;

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            console.error(error);

            if (error.code === "invalid_credentials")
                setErrorMessage("Błędny e-mail lub hasło");
            else
                setErrorMessage(error.message);
            return;
        }
        console.log(data);

        const patient = await supabase.from("patient")
            .select("email")
            .eq("email", email)
            .single();

        navigate(patient.status !== 200 ? "/doctor" : "/patient");
    };

    return (
        <>
            <div className={styles.root}>
                <form className={styles.container} onSubmit={(e) => { void handleSubmit(e); }}>
                    <div className={styles.heading}>Logowanie</div>
                    <input
                        required
                        type="text"
                        name="email"
                        placeholder="Email"
                        className={styles.textInput}
                    />
                    <input
                        required
                        type="password"
                        name="password"
                        placeholder="Hasło"
                        className={styles.textInput}
                    />
                    <div className={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            placeholder="Nie wylogowywuj mnie"
                            className={styles.checkbox}
                        />
                        Nie wylogowywuj mnie
                    </div>
                    {errorMessage && (
                        <div className={styles.errorMessage}>
                            <IoWarning size={22} />
                            {errorMessage}
                        </div>
                    )}
                    <input
                        type="submit"
                        value="Zaloguj się"
                        className={styles.btn}
                    />
                    <div className={styles.suggestion}>
                        Nie masz konta? <Link className={styles.link} to="/register">Zarejestruj się!</Link>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Login;
