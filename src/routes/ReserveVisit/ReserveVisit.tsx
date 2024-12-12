import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ReserveVisit.module.css";
import { useSupabase } from "../../contexts/SupabaseProvider";

interface Doctor {
    id: number;
    first_name: string;
    last_name: string;
}

const ReserveVisit: React.FC = () => {
    const supabase = useSupabase();
    const [searchQuery, setSearchQuery] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleSearch = async () => {
            setLoading(true);
            try {
                const { data, error } = specialization
                    ? await supabase
                        .from("doctor")
                        .select("id, first_name, last_name, specialization")
                        .eq("specialization", specialization)
                        .ilike("last_name", `%${searchQuery}%`)
                    : await supabase
                        .from("doctor")
                        .select("id, first_name, last_name, specialization")
                        .ilike("last_name", `%${searchQuery}%`);

                if (error) {
                    console.error("Blad podczas wyszukiwania:", error.message);
                } else {
                    setDoctors(data);
                }
            } catch (err) {
                console.error("Nieoczekiwany blad:", err);
            } finally {
                setLoading(false);
            }
        };
        void handleSearch();
    }, [searchQuery, specialization, supabase]);

    return (
        <div className={styles.root}>
            <div className={styles.searchingFiltersContainer}>
                <div className={styles.searchingFiltersItem}>
                    <div>
                        <input
                            placeholder="Szukaj doktora po nazwisku..."
                            className={styles.searchBar}
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); }}
                        />
                    </div>
                </div>
                <div className={styles.searchingFiltersItem}>
                    <label
                        htmlFor="specialization"
                        className={styles.searchingFiltersLabel}
                    >
                        Lista specjalizacji:
                    </label>
                    <select
                        className={styles.select}
                        onChange={(e) => { setSpecialization(e.target.value); }}
                        name="specialization"
                        id="specialization"
                    >
                        <option value="" defaultChecked>Dowolna</option>
                        <option value="neurolog">Neurolog</option>
                        <option value="ortopeda">Ortopeda</option>
                        <option value="cardiolog">Kardiolog</option>
                        <option value="urolog">Urolog</option>
                    </select>
                </div>
            </div>
            <h3>Wyniki wyszukiwania</h3>
            {!loading && doctors.length === 0 && (
                <p>Brak wyników.</p>
            )}
            <ul>
                {doctors.map(doctor => (
                    <Link key={doctor.id} to={`/doctor/${doctor.id.toString()}`}>
                        <li>
                            {doctor.first_name} {doctor.last_name}
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
};

export default ReserveVisit;
