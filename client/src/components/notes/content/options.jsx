import { MdAddAlarm, MdFormatColorFill, MdUndo, MdRedo, MdDelete, MdDeleteForever, MdRestoreFromTrash } from 'react-icons/md'
import { RiArchive2Fill, RiInboxUnarchiveFill } from "react-icons/ri";

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
            default: <RiInboxUnarchiveFill />,
        },
        alt: 'Desarchivar'
    },
    {
        id: 5,
        icon: {
            default: <MdUndo />,
        },
        alt: 'Deshacer'
    },
    {
        id: 6,
        icon: {
            default: <MdRedo />,
        },
        alt: 'Rehacer'
    },
    {
        id: 7,
        icon: {
            default: <MdDelete />,
        },
        alt: 'Eliminar'
    },
    {
        id: 8,
        icon: {
            default: <MdDeleteForever />,
        },
        alt: 'Eliminar definitivamente'
    },
    {
        id: 9,
        icon: {
            default: <MdRestoreFromTrash />,
        },
        alt: 'Restaurar'
    }
]