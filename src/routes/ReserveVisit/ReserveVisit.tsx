import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx/lite";

import styles from "./ReserveVisit.module.css";
import { useSupabase } from "../../contexts/SupabaseProvider";
import { IDoctor } from "../../types/IDoctor";

const ReserveVisit: React.FC = () => {
    const supabase = useSupabase();
    const [searchQuery, setSearchQuery] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [doctors, setDoctors] = useState<IDoctor[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleSearch = async () => {
            setLoading(true);
            try {
                const { data, error } = specialization
                    ? await supabase
                        .from("doctor")
                        .select("id, first_name, last_name, specialization, work_time")
                        .eq("specialization", specialization)
                        .ilike("last_name", `%${searchQuery}%`)
                    : await supabase
                        .from("doctor")
                        .select("id, first_name, last_name, specialization, work_time")
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
                        Specjalizacja:
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
                        <option value="kardiolog">Kardiolog</option>
                        <option value="urolog">Urolog</option>
                    </select>
                </div>
            </div>
            <h3>Wyniki wyszukiwania</h3>
            {!loading && doctors.length === 0 && (
                <p>Brak wyników.</p>
            )}
            {!loading && (
                <div className={styles.list}>
                    <div className={clsx(styles.listHeadingRow, styles.listRow)}>
                        <div className={styles.listCol}>Imię</div>
                        <div className={styles.listCol}>Nazwisko</div>
                        <div className={styles.listCol}>Specjalizacja</div>
                    </div>
                    {doctors.map(doctor => (
                        <Link
                            key={doctor.id}
                            to={doctor.id.toString()}
                        >
                            <div className={styles.listRow} key={doctor.id}>

                                <div className={styles.listCol}>{doctor.first_name}</div>
                                <div className={styles.listCol}>{doctor.last_name}</div>
                                <div className={styles.listCol}>{doctor.specialization}</div>
                            </div>
                        </Link>
                    ))}
                </div>

            )}
        </div>
    );
};

export default ReserveVisit;
