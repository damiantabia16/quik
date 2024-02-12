import { createContext, useState } from "react";

export const MenuContext = createContext();

export const useMenuContext = () => useContext(MenuContext);

export const MenuProvider = ({ children }) => {
    const [ menu, setMenu ] = useState(false);

    const toggleMenu = () => {
        setMenu(!menu);
    };

    return (
        <MenuContext.Provider value={{ menu, toggleMenu }}>
            {children}
        </MenuContext.Provider>
    )
}