import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./index.css";
import router from "./router.ts";
import SupabaseProvider from "./contexts/SupabaseProvider.tsx";
import ThemeProvider from "./contexts/ThemeProvider.tsx";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider>
            <SupabaseProvider>
                <RouterProvider router={router} />
            </SupabaseProvider>
        </ThemeProvider>
    </React.StrictMode>,
);
