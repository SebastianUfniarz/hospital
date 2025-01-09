import { Suspense, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import styles from "./PatientApp.module.css";
import AppHeader from "./components/AppHeader/AppHeader";
import { useSupabase } from "./contexts/SupabaseProvider";

const links = [
    {
        pathname: "/patient/reserve_visit",
        name: "Rezerwacja wizyty",
    },
    {
        pathname: "/patient/my_visits",
        name: "Moje wizyty",
    },
    {
        pathname: "/patient/treatment_history",
        name: "Historia leczenia",
    },
    {
        pathname: "/patient/my_data",
        name: "Moje dane",
    },
    {
        pathname: "/logout",
        name: "Wyloguj się",
    },
];

const PatientApp: React.FC = () => {
    const supabase = useSupabase();
    const navigate = useNavigate();

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        (async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) navigate("/");

            const patient = await supabase.from("patient")
                .select("email")
                .eq("email", data.session?.user.email)
                .single();

            if (patient.status !== 200) navigate("/doctor");
        })();
    }, [navigate, supabase, supabase.auth]);

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

export default PatientApp;
