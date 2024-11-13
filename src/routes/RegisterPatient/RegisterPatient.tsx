import { Link } from "react-router-dom";
import { FormEvent, useState } from "react";

import styles from "./RegisterPatient.module.css";

const RegisterPatient: React.FC = () => {
    const [isNext, setNext] = useState(false);

    const handleClickNext = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setNext(true);
    };

    return (
        <>
            <div className={styles.root}>
                <div className={styles.container}>
                    <div className={styles.heading}>Rejestracja pacjenta</div>

                    <form onSubmit={handleClickNext} style={{ display: isNext ? "none" : "block" }}>
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
                        <input
                            required
                            type="password"
                            placeholder="Powtórz hasło"
                            className={styles.textInput}
                        />
                        <input
                            type="submit"
                            value="Dalej"
                            className={styles.btn}
                        />
                    </form>

                    <form style={{ display: !isNext ? "none" : "block" }}>
                        <input
                            required
                            type="text"
                            placeholder="Imię"
                            className={styles.textInput}
                        />
                        <input
                            required
                            type="text"
                            placeholder="Nazwisko"
                            className={styles.textInput}
                        />
                        <input
                            required
                            type="number"
                            placeholder="PESEL"
                            className={styles.textInput}
                        />
                        <input
                            required
                            type="text"
                            placeholder="Data urodzenia (RRRR-MM-DD)"
                            className={styles.textInput}
                        />
                        <input
                            required
                            type="text"
                            placeholder="Numer telefonu"
                            className={styles.textInput}
                        />
                        <div className={styles.checkboxContainer}>
                            <input
                                required
                                type="checkbox"
                                className={styles.checkbox}
                            />
                            Akceptuję regulamin serwisu
                        </div>
                        <input
                            type="submit"
                            value="Załóż konto"
                            className={styles.btn}
                        />
                    </form>

                    <div className={styles.suggestion}>
                        Masz już konto? <Link className={styles.loginLink} to="/login">Zaloguj się!</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterPatient;
