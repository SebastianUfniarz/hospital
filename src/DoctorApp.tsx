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
        pathname: "/doctor/visits",
        name: "Wizyty",
    },
    {
        pathname: "/doctor/my_patients",
        name: "Moi pacjenci",
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
        void (async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                navigate("/");
                return;
            }

            const doctor = await supabase.from("doctor")
                .select("email")
                .eq("email", data.session.user.email)
                .single();

            if (doctor.status !== 200) navigate("/patient");
        })();
    }, [navigate, supabase, supabase.auth]);

    return (
        <>
            <AppHeader links={links} />
            <div className={styles.wrapper}>
                <Suspense>
                    <Outlet />
                </Suspense>
            </div>
        </>
    );
};

export default DoctorApp;
