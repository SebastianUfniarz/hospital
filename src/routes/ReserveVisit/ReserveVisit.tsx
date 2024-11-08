import { Link } from "react-router-dom";
import styles from "./ReserveVisit.module.css";

const ReserveVisit: React.FC = () => {
    return (
        <div className={styles.root}>
            <div>
                <div>Lista specjalizacji</div>
                <select name="specialization" id="specialization">
                    <option value="neuro">Neurolog</option>
                    <option value="orto">Ortopeda</option>
                    <option value="kardio">Kardiolog</option>
                    <option value="uro">Urolog</option>
                </select>
            </div>
            <div className={styles.searchBarContainer}>
                <input
                    placeholder="Szukaj..."
                    className={styles.searchBar}
                />
            </div>
            <h3>Wyniki wyszukiwania</h3>
            <ul>
                <Link to="/">
                    <li>
                        Dr Gerard
                    </li>
                </Link>
                <Link to="/">
                    <li>
                        Dr Oetker
                    </li>
                </Link>
                <Link to="/">
                    <li>
                        Lider Artur
                    </li>
                </Link>
            </ul>
        </div>
    );
};

export default ReserveVisit;
