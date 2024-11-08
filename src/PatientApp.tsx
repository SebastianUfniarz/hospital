import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import styles from "./PatientApp.module.css";
import AppHeader from "./components/AppHeader/AppHeader";

const PatientApp: React.FC = () => {
    return (
        <>
            <AppHeader className={styles.appHeader} />
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
