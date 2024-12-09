import { Link, useLocation } from "react-router-dom";
import styles from "./LandingPage.module.css";
import { IoNotifications } from "react-icons/io5";

const LandingPage: React.FC = () => {
    const location = useLocation();
    const state = location.state as string | undefined;

    return (
        <div className={styles.root}>
            {state && state === "EMAIL_SENT" && (
                <div className={styles.notification}>
                    <IoNotifications size={24} />
                    E-mail weryfikacyjny został wysłany na podany adres.
                </div>
            )}
            <div className={styles.container}>
                <div className={styles.heading}>System szpitalny</div>
                <Link to="/login">
                    <button className={styles.btn}>Zaloguj się jako pacjent</button>
                </Link>
                <Link to="/login">
                    <button className={styles.btn}>Zaloguj się jako lekarz</button>
                </Link>
                <Link to="/register">
                    <button className={styles.btn}>Załóż konto</button>
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;
