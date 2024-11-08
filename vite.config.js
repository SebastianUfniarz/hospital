// @ts-check
import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(env => ({
    plugins: [react()],
    css: {
        modules: {
            generateScopedName: env.mode == "development"
                ? (className, filePath) => {
                        const fileName = path.basename(filePath, ".module.css");
                        return `${fileName}__${className}`;
                    }
                : undefined,
        },
    },
}));
