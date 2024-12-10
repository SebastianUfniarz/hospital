import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import styles from "./PatientApp.module.css";
import AppHeader from "./components/AppHeader/AppHeader";

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
