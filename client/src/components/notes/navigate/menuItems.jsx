import { BsFileText } from "react-icons/bs";
import { PiAlarmBold } from "react-icons/pi";
import { RiArchive2Fill } from "react-icons/ri";
import { FaRegTrashCan } from "react-icons/fa6";

export const menuItems = [
    {
        id: 1,
        icon: <BsFileText />,
        icon_label: 'BsFileText',
        label: 'Notas',
        path: 'notas',
    },
    {
        id: 2,
        icon: <PiAlarmBold />,
        icon_label: 'PiAlarmBold',
        label: 'Recordatorios',
        path: 'recordatorios',
    },
    {
        id: 3,
        icon: <RiArchive2Fill />,
        icon_label: 'RiArchive2Fill',
        label: 'Archivos',
        path: 'archivos',
    },
    {
        id: 4,
        icon: <FaRegTrashCan />,
        icon_label: 'FaRegTrashCan',
        label: 'Papelera',
        path: 'papelera',
    }
]