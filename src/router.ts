import { createBrowserRouter } from "react-router-dom";

import PatientApp from "./PatientApp.tsx";
import DoctorApp from "./DoctorApp.tsx";
import ErrorPage from "./routes/ErrorPage.tsx";
import MainRoute from "./routes/MainRoute/MainRoute.tsx";
import Login from "./routes/Login/Login.tsx";
import RegisterPatient from "./routes/RegisterPatient/RegisterPatient.tsx";
import LandingPage from "./routes/LandingPage/LandingPage.tsx";
import ReserveVisit from "./routes/ReserveVisit/ReserveVisit.tsx";
import MyData from "./routes/MyData/MyData.tsx";
import ChangePassword from "./routes/ChangePassword/ChangePassword.tsx";
import DoctorSchedule from "./routes/DoctorSchedule/DoctorSchedule.tsx";
import Logout from "./routes/Logout/Logout.tsx";
import TreatmentHistory from "./routes/TreatmentHistory/TreatmentHistory.tsx";
import MyPatients from "./routes/MyPatients/MyPatients.tsx";
import RegisterDoctor from "./routes/RegisterDoctor/RegisterDoctor.tsx";
import ReserveVisitDoctor from "./routes/ReserveVisitDoctor/ReserveVisitDoctor.tsx";
import MyVisits from "./routes/MyVisits/MyVisits.tsx";

const router = createBrowserRouter([
    {
        Component: PatientApp,
        ErrorBoundary: ErrorPage,
        children: [
            {
                path: "/patient",
                Component: MainRoute,
                ErrorBoundary: ErrorPage,
            },
            {
                path: "/patient/reserve_visit",
                Component: ReserveVisit,
                ErrorBoundary: ErrorPage,
            },
            {
                path: "/patient/reserve_visit/:doctorId",
                Component: ReserveVisitDoctor,
                ErrorBoundary: ErrorPage,
                // eslint-disable-next-line @typescript-eslint/require-await
                loader: async ({ params }): Promise<string> => {
                    return params.doctorId ?? "";
                },
            },
            {
                path: "/patient/treatment_history",
                Component: TreatmentHistory,
                ErrorBoundary: ErrorPage,
            },
            {
                path: "/patient/my_data",
                Component: MyData,
                ErrorBoundary: ErrorPage,
            },
            {
                path: "/patient/my_visits",
                Component: MyVisits,
                ErrorBoundary: ErrorPage,
            },
        ],
    },
    {
        Component: DoctorApp,
        ErrorBoundary: ErrorPage,
        children: [
            {
                path: "/doctor",
                Component: DoctorSchedule,
                ErrorBoundary: ErrorPage,
            },
            {
                path: "/doctor/my_patients",
                Component: MyPatients,
                ErrorBoundary: ErrorPage,
            },
            {
                path: "/doctor/schedule",
                Component: DoctorSchedule,
                ErrorBoundary: ErrorPage,
            },
        ],
    },
    {
        path: "/",
        Component: LandingPage,
        ErrorBoundary: ErrorPage,
    },
    {
        path: "/login",
        Component: Login,
        ErrorBoundary: ErrorPage,
    },
    {
        path: "/register",
        Component: RegisterPatient,
        ErrorBoundary: ErrorPage,
    },
    {
        path: "/register_doctor",
        Component: RegisterDoctor,
        ErrorBoundary: ErrorPage,
    },
    {
        path: "/change_password",
        Component: ChangePassword,
        ErrorBoundary: ErrorPage,
    },
    {
        path: "/logout",
        Component: Logout,
        ErrorBoundary: ErrorPage,
    },
]);

export default router;
