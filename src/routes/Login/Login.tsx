import { Link } from "react-router-dom";

import styles from "./Login.module.css";
import { useSupabase } from "../../contexts/SupabaseProvider";

interface FormTarget extends EventTarget {
    email: HTMLInputElement;
    password: HTMLInputElement;
}

const Login: React.FC = () => {
    const { auth } = useSupabase();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const email = (e.target as FormTarget).email.value;
        const password = (e.target as FormTarget).password.value;

        const { data, error } = await auth.signInWithPassword({
            email,
            password,
        });
        console.log(data);
        console.log(error);
    };

    return (
        <>
            <div className={styles.root}>
                {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                <form className={styles.container} onSubmit={handleSubmit}>
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
                    <input
                        type="submit"
                        value="Zaloguj się"
                        className={styles.btn}
                    />
                    <div className={styles.suggestion}>
                        Nie masz konta? <Link className={styles.registerLink} to="/register">Zarejestruj się!</Link>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Login;
