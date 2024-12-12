import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBack, IoWarning } from "react-icons/io5";

import styles from "../Login/Login.module.css";
import { useSupabase } from "../../contexts/SupabaseProvider";
import IconButton from "../../components/IconButton/IconButton";

interface AuthFormTarget extends EventTarget {
    email: HTMLInputElement;
    password: HTMLInputElement;
    confirmPassword: HTMLInputElement;
}

interface UserDataFormTarget extends EventTarget {
    firstName: HTMLInputElement;
    lastName: HTMLInputElement;
    pesel: HTMLInputElement;
    birthDate: HTMLInputElement;
    telephone: HTMLInputElement;
}

interface AuthCredentials {
    email: string;
    password: string;
}

const RegisterDoctor: React.FC = () => {
    const supabase = useSupabase();
    const navigate = useNavigate();
    const [isNext, setNext] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>();
    const [authCredentials, setAuthCredentials] = useState<AuthCredentials>({ email: "", password: "" });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as UserDataFormTarget;
        const firstName = target.firstName.value;
        const lastName = target.lastName.value;
        const pesel = target.pesel.value;
        const birthDate = target.birthDate.value;
        const telephone = target.telephone.value;
        const { email } = authCredentials;

        const res = await supabase.auth.signUp({
            email: authCredentials.email,
            password: authCredentials.password,
        });
        console.log(res);

        if (res.error) {
            setErrorMessage(res.error.message);
            return;
        }

        const res2 = await supabase.from("doctor").insert({
            "first_name": firstName,
            "last_name": lastName,
            "birth_date": birthDate,
            telephone,
            email,
            pesel,
        });
        console.log(res2);

        if (res2.error) {
            setErrorMessage(res2.error.message);
            return;
        }

        navigate("/", { state: "EMAIL_SENT" });
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
                    {isNext && (
                        <IconButton title="Cofnij" onClick={() => { setNext(false); }}>
                            <IoArrowBack size={24} />
                        </IconButton>
                    )}
                    <div className={styles.heading}>Rejestracja lekarza</div>
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
                            minLength={6}
                            type="password"
                            name="password"
                            placeholder="Hasło"
                            className={styles.textInput}
                        />
                        <input
                            required
                            minLength={6}
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
                            name="pesel"
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
                            minLength={9}
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
                        {errorMessage && (
                            <div className={styles.errorMessage}>
                                <IoWarning size={22} />
                                {errorMessage}
                            </div>
                        )}
                        <input
                            type="submit"
                            value="Załóż konto"
                            className={styles.btn}
                        />
                    </form>

                    <div className={styles.suggestion}>
                        Masz już konto? <Link className={styles.link} to="/login">Zaloguj się!</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterDoctor;
