import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./ReserveVisit.module.css";
import { useSupabase } from "../../contexts/SupabaseProvider";
import { IDoctor } from "../../types/IDoctor";

const ReserveVisit: React.FC = () => {
    const supabase = useSupabase();
    const navigate = useNavigate();
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
            <h2>Rezerwacja wizyty</h2>
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
            <h4>Wyniki wyszukiwania</h4>
            {!loading && doctors.length === 0 && <p>Brak wyników.</p>}
            {!loading && doctors.length !== 0 && (
                <div className={styles.list}>
                    <div className={styles.listHeadingRow}>
                        <div className={styles.listCol}>Imię</div>
                        <div className={styles.listCol}>Nazwisko</div>
                        <div className={styles.listCol}>Specjalizacja</div>
                        <div className={styles.listCol}>Opcje</div>
                    </div>
                    {doctors.map(doctor => (
                        <Fragment key={doctor.id}>
                            <div className={styles.listCol}>{doctor.first_name}</div>
                            <div className={styles.listCol}>{doctor.last_name}</div>
                            <div className={styles.listCol}>{doctor.specialization}</div>
                            <div className={styles.listCol}>
                                <button
                                    className={styles.btn}
                                    onClick={() => { navigate(doctor.id.toString()); }}
                                >
                                    Wybierz
                                </button>
                            </div>
                        </Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReserveVisit;
