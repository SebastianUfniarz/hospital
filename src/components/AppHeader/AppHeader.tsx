import { Link, useLocation } from "react-router-dom";
import clsx from "clsx/lite";

import styles from "./AppHeader.module.css";
// import logo from "../../assets/logo.svg";

interface IProps {
    className?: string;
    links: {
        pathname: string;
        name: string;
    }[];
}

const AppHeader: React.FC<IProps> = ({ className, links }) => {
    const location = useLocation();
    console.log(location);

    return (
        <header className={clsx(styles.root, className)}>
            <Link className={styles.title} to="/">
                {/* <img className={styles.logo} src={logo} alt="Logo" height={51} width={76} /> */}
                <div className={styles.heading}>System szpitalny</div>
            </Link>
            <nav className={styles.nav}>
                {links.map(l => (
                    <Link
                        to={l.pathname}
                        key={l.pathname}
                        className={clsx(l.pathname === location.pathname && styles.activeNav)}
                    >
                        {l.name}
                    </Link>
                ))}
            </nav>
        </header>
    );
};

export default AppHeader;
