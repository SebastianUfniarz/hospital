import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import styles from "./PatientApp.module.css";
import AppHeader from "./components/AppHeader/AppHeader";

const links = [
    {
        pathname: "/patient/reserve_visit",
        name: "Mój harmonogram",
    },
    {
        pathname: "/patient/my_visits",
        name: "Moi pacjenci",
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

const DoctorApp: React.FC = () => {
    return (
        <>
            <AppHeader className={styles.appHeader} links={links} />
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
