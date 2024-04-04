const useTextEditor = () => {
    const isStyleApplied = (style, range) => {
        if (!range || range.collapsed) {
            return false;
        }

        const element = range.commonAncestorContainer.nodeType === 1 ? range.commonAncestorContainer : range.commonAncestorContainer.parentElement;

        if (!element) {
            return false;
        }

        const appliedStyles = window.getComputedStyle(element);

        switch (style) {
            case 'bold':
                return appliedStyles.fontWeight === '600';
            case 'italic':
                return appliedStyles.fontStyle === 'italic';
            case 'underline':
                return appliedStyles.textDecoration.includes('underline');
            case 'strike':
                return appliedStyles.textDecoration.includes('line-through');
            case 'ordered-list':
                return appliedStyles.listStyle.includes('decimal');
            case 'bullet-list':
                return appliedStyles.listStyle.includes('•  ');
            default:
                return false;
        }
    };

    const handleStyles = (styleId) => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        const selectedText = range.toString();

        const currentStyles = {
            bold: isStyleApplied('bold', range),
            italic: isStyleApplied('italic', range),
            underline: isStyleApplied('underline', range),
            color: isStyleApplied('color', range),
            strike: isStyleApplied('strike', range),
            ordered_list: isStyleApplied('ordered-list', range),
            bullet_list: isStyleApplied('bullet-list', range)
        };

        switch (styleId) {
            case 1:
                currentStyles.bold = !currentStyles.bold;
                break;
            case 2:
                currentStyles.italic = !currentStyles.italic;
                break;
            case 3:
                currentStyles.underline = !currentStyles.underline;
                break;
            case 4:
                currentStyles.strike = !currentStyles.strike;
                break;
            case 5:
                currentStyles.ordered_list = !currentStyles.ordered_list;
                break;
            case 6:
                currentStyles.bullet_list = !currentStyles.bullet_list;
                break;
            default:
                return;
        }

        let newContent = selectedText;

        if (currentStyles.underline) {
            newContent = `<u>${newContent}</u>`;
        }
        if (currentStyles.strike) {
            newContent = `<s>${newContent}</s>`;
        }
        if (currentStyles.bold) {
            newContent = `<strong>${newContent}</strong>`;
        }
        if (currentStyles.italic) {
            newContent = `<em>${newContent}</em>`;
        }
        if (currentStyles.ordered_list) {
            newContent = `<ol><li>${newContent}</li></ol>`;
        }
        if (currentStyles.bullet_list) {
            newContent = `<ul><li>${newContent}</li></ul>`;
        }

        document.execCommand('insertHTML', false, newContent);
    };

    return { isStyleApplied, handleStyles };
};

export default useTextEditor;
