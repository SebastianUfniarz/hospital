import clsx from "clsx/lite";

import styles from "./IconButton.module.css";

interface IProps {
    children: React.ReactNode;
    title: string;
    className?: string;
    chipVariant?: boolean;
    onClick?: () => void;
}

const IconButton: React.FC<IProps> = ({ children, title, chipVariant, className, onClick }) => {
    return (
        <button
            className={clsx(styles.root, chipVariant && styles.chipVariant, className)}
            title={title}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default IconButton;
