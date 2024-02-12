import { useContext } from "react";
import { MenuContext } from "../context/MenuContext"

export const useMenu = () => {
    const context = useContext(MenuContext);

    if ( context === undefined ) {
        throw new Error('useMenu must be used withian a MenuProvider');
    }

    return context
};