import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import styles from "./PatientApp.module.css";
import AppHeader from "./components/AppHeader/AppHeader";

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
