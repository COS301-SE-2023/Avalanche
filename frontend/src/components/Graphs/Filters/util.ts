
const generateDefaultValue = (type: string) => {
    switch (type) {
        case "togglebox": {
            return false;
        }
        case "string": {
            return "";
        }
        case "checkbox": {
            return [];
        }
        case "radiobox": {
            return "";
        }
        case "nestedCheckbox": {
            return [];
        }
        case "inputbox": {
            return "";
        }
    }
}

const camelCaseRenderer = (value: string) => {
    return value.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })
}

export { generateDefaultValue, camelCaseRenderer };