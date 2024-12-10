import { createBrowserRouter } from "react-router-dom";

import ErrorPage from "./routes/ErrorPage.tsx";
import MainRoute from "./routes/MainRoute/MainRoute.tsx";
import Login from "./routes/Login/Login.tsx";
import RegisterPatient from "./routes/RegisterPatient/RegisterPatient.tsx";
import PatientApp from "./PatientApp.tsx";
import LandingPage from "./routes/LandingPage/LandingPage.tsx";
import ReserveVisit from "./routes/ReserveVisit/ReserveVisit.tsx";
import DoctorApp from "./DoctorApp.tsx";
import MyData from "./routes/MyData/MyData.tsx";
import ChangePassword from "./routes/ChangePassword/ChangePassword.tsx";

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
                path: "/patient/my_data",
                Component: MyData,
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
                Component: MainRoute,
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
        path: "/change_password",
        Component: ChangePassword,
        ErrorBoundary: ErrorPage,
    },
]);

export default router;
