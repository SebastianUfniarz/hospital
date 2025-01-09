import { Suspense, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import styles from "./PatientApp.module.css";
import AppHeader from "./components/AppHeader/AppHeader";
import { useSupabase } from "./contexts/SupabaseProvider";

const links = [
    {
        pathname: "/doctor/schedule",
        name: "Mój harmonogram",
    },
    {
        pathname: "/doctor/my_patients",
        name: "Moi pacjenci",
    },
    {
        pathname: "/doctor/treatment_history",
        name: "Historia leczenia",
    },
    {
        pathname: "/doctor/my_data",
        name: "Moje dane",
    },
    {
        pathname: "/logout",
        name: "Wyloguj się",
    },
];

const DoctorApp: React.FC = () => {
    const supabase = useSupabase();
    const navigate = useNavigate();

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        (async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) navigate("/");
        })();
    }, [navigate, supabase.auth]);

    return (
        <>
            <AppHeader links={links} />
            <div className={styles.wrapper}>
                <div className={styles.leftRight}>
                    <Suspense>
                        <Outlet />
                    </Suspense>
                </div>
            </div>
        </>
    );
};

export default DoctorApp;
