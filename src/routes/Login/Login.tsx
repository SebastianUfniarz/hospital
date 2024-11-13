import { Link } from "react-router-dom";

import styles from "./Login.module.css";

const Login: React.FC = () => {
    return (
        <>
            <div className={styles.root}>
                <form className={styles.container}>
                    <div className={styles.heading}>Logowanie</div>
                    <input
                        required
                        type="text"
                        placeholder="Nazwa użytkownika"
                        className={styles.textInput}
                    />
                    <input
                        required
                        type="password"
                        placeholder="Hasło"
                        className={styles.textInput}
                    />
                    <div className={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            placeholder="Hasło"
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
