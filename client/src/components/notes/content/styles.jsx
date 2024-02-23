import { MdFormatBold, MdFormatItalic, MdFormatUnderlined, MdFormatColorText, MdFormatStrikethrough, MdFormatAlignLeft, MdFormatAlignCenter, MdFormatAlignRight, MdFormatListNumbered, MdFormatListBulleted, MdAddLink } from 'react-icons/md'

export const styles = [
    {
        id: 1,
        name: 'bold',
        icon: {
            default: <MdFormatBold />
        },
        alt: 'Negrita'
    },
    {
        id: 2,
        name: 'italic',
        icon: {
            default: <MdFormatItalic />
        },
        alt: 'Cursiva'
    },
    {
        id: 3,
        name: 'underline',
        icon: {
            default: <MdFormatUnderlined />
        },
        alt: 'Subrayado'
    },
    {
        id: 4,
        name: 'color',
        icon: {
            default: <MdFormatColorText />
        },
        alt: 'Color del texto'
    },
    {
        id: 5,
        name: 'strike',
        icon: {
            default: <MdFormatStrikethrough />
        },
        alt: 'Tachar'
    },
    {
        id: 6,
        name: 'list',
        type: 'ordered',
        icon: {
            default: <MdFormatListNumbered />
        },
        alt: 'Lista numerada'
    },
    {
        id: 7,
        name: 'list',
        type: 'bullet',
        icon: {
            default: <MdFormatListBulleted />
        },
        alt: 'Lista con viñetas'
    },
    {
        id: 8,
        name: 'link',
        icon: {
            default: <MdAddLink />
        },
        alt: 'Añadir enlace'
    }
]