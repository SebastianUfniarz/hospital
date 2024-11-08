import { Link } from "react-router-dom";
import styles from "./LandingPage.module.css";

const LandingPage: React.FC = () => {
    return (
        <div className={styles.root}>
            <div className={styles.heading}>System szpitalny</div>
            <Link to="/login">
                <button className={styles.btn}>Zaloguj się</button>
            </Link>
            <Link to="/register">
                <button className={styles.btn}>Załóż konto</button>
            </Link>
        </div>
    );
};

export default LandingPage;
