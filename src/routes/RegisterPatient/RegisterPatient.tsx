import { Link } from "react-router-dom";
import { FormEvent, useState } from "react";
import { useSupabase } from "../../contexts/SupabaseProvider";

import styles from "../Login/Login.module.css";

interface AuthFormTarget extends EventTarget {
    email: HTMLInputElement;
    password: HTMLInputElement;
    confirmPassword: HTMLInputElement;
}

interface UserDataFormTarget extends EventTarget {
    firstName: HTMLInputElement;
    lastName: HTMLInputElement;
    PESEL: HTMLInputElement;
    birthDate: HTMLInputElement;
    telephone: HTMLInputElement;
}

interface AuthCredentials {
    email: string;
    password: string;
}

const RegisterPatient: React.FC = () => {
    const supabase = useSupabase();
    const [isNext, setNext] = useState(false);
    const [authCredentials, setAuthCredentials] = useState<AuthCredentials>({ email: "", password: "" });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as UserDataFormTarget;
        const firstName = target.firstName.value;
        const lastName = target.lastName.value;
        const PESEL = target.PESEL.value;
        const birthDate = target.birthDate.value;
        const telephone = target.telephone.value;

        const { data, error } = await supabase.auth.signUp({
            email: authCredentials.email,
            password: authCredentials.password,
        });

        console.log(data);
        console.log(error);

        const res2 = await supabase.from("patient").insert({
            firstName, lastName, PESEL, birthDate, telephone,
        });
        console.log(res2);
    };

    const handleClickNext = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as AuthFormTarget;
        const email = target.email.value;
        const password = target.password.value;
        const confirmPassword = target.confirmPassword.value;

        if (password !== confirmPassword) throw Error("Hasła się nie zgadzają!");

        setAuthCredentials({ email, password });
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
                        <input
                            required
                            type="password"
                            name="confirmPassword"
                            placeholder="Powtórz hasło"
                            className={styles.textInput}
                        />
                        <input
                            type="submit"
                            value="Dalej"
                            className={styles.btn}
                        />
                    </form>

                    {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                    <form onSubmit={handleSubmit} style={{ display: !isNext ? "none" : "block" }}>
                        <input
                            required
                            type="text"
                            name="firstName"
                            placeholder="Imię"
                            className={styles.textInput}
                        />
                        <input
                            required
                            type="text"
                            name="lastName"
                            placeholder="Nazwisko"
                            className={styles.textInput}
                        />
                        <input
                            required
                            type="number"
                            name="PESEL"
                            placeholder="PESEL"
                            className={styles.textInput}
                        />
                        <input
                            required
                            type="text"
                            name="birthDate"
                            placeholder="Data urodzenia (RRRR-MM-DD)"
                            className={styles.textInput}
                        />
                        <input
                            required
                            type="number"
                            name="telephone"
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
