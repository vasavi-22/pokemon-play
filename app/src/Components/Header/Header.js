import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
    return(
        <div className={styles.header}>
            <Link to="/">
                <img src="/images/poke.png" alt="pokemon" />
            </Link>
        </div>
    );
}

export default Header;