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
        name: 'strike',
        icon: {
            default: <MdFormatStrikethrough />
        },
        alt: 'Tachar'
    },
    {
        id: 5,
        name: 'ordered-list',
        icon: {
            default: <MdFormatListNumbered />
        },
        alt: 'Lista ordenada'
    },
    {
        id: 6,
        name: 'bullet-list',
        icon: {
            default: <MdFormatListBulleted />
        },
        alt: 'Lista con viñetas'
    }
]