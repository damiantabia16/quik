import { MdAddAlarm, MdFormatColorFill, MdImage, MdUndo, MdRedo } from 'react-icons/md'
import { RiArchive2Fill } from "react-icons/ri";
import { FaRegTrashCan } from "react-icons/fa6";

export const options = [
    {
        id: 1,
        icon: {
            default: <MdAddAlarm />
        },
        alt: 'Añadir recordatorio'
    },
    {
        id: 2,
        icon: {
            default: <MdFormatColorFill />
        },
        alt: 'Color de fondo'
    },
    {
        id: 3,
        icon: {
            default: <RiArchive2Fill />
        },
        alt: 'Archivar'
    },
    {
        id: 4,
        icon: {
            default: <MdUndo />,
        },
        alt: 'Deshacer'
    },
    {
        id: 5,
        icon: {
            default: <MdRedo />,
        },
        alt: 'Rehacer'
    },
    {
        id: 6,
        icon: {
            default: <FaRegTrashCan />,
        },
        alt: 'Eliminar'
    }
]