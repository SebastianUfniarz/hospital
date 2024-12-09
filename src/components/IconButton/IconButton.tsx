import clsx from "clsx/lite";

import styles from "./IconButton.module.css";

interface IProps {
    children: React.ReactNode;
    title: string;
    className?: string;
    onClick?: () => void;
}

const IconButton: React.FC<IProps> = ({ children, title, className, onClick }) => {
    return (
        <button
            className={clsx(styles.root, className)}
            title={title}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default IconButton;
