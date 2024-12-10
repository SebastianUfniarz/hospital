import { useEffect } from "react";
import { useSupabase } from "../../contexts/SupabaseProvider";
import styles from "./Logout.module.css";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
    const { auth } = useSupabase();
    const navigate = useNavigate();

    useEffect(() => {
        void (async () => {
            const res = await auth.signOut();
            console.log(res);
            navigate("/");
        })();
    }, [auth, navigate]);
    return (
        <div className={styles.root}>
            Wylogowywanie...
        </div>
    );
};

export default Logout;
