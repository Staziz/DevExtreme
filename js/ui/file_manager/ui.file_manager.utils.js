import { each } from "../../core/utils/iterator";
import { isString } from "../../core/utils/type";

const PATH_SEPARATOR = "/";

const getFileExtension = path => {
    const index = path.lastIndexOf(".");
    return index !== -1 ? path.substr(index) : "";
};

const getName = path => {
    if(isString(path)) {
        return path;
    }
    const result = path || [];
    return result[result.length - 1];
};

const getParentPath = path => {
    const result = path || [];
    return result.length !== 1 ? result.slice(0, result.length - 1).join(PATH_SEPARATOR) : "";
};

const getPathParts = (path, includeFullPath) => {
    const result = (path || [])
        .map(p => p.trim())
        .filter(p => p);

    if(includeFullPath) {
        for(let i = 0; i < result.length; i++) {
            result[i] = pathCombine(i === 0 ? "" : result[i - 1], result[i]);
        }
    }

    return result;
};

const pathCombine = function() {
    let result = [];

    each(arguments, (_, arg) => {
        if(arg) {
            result.push(arg);
        }
    });

    return result;
};

const getDisplayFileSize = function(byteSize) {
    const sizesTitles = [ "B", "KB", "MB", "GB", "TB" ];
    let index = 0;
    let displaySize = byteSize;
    while(displaySize >= 1024 && index <= sizesTitles.length - 1) {
        displaySize /= 1024;
        index++;
    }
    displaySize = Math.round(displaySize * 10) / 10;
    return `${displaySize} ${sizesTitles[index]}`;
};

module.exports.getFileExtension = getFileExtension;
module.exports.getName = getName;
module.exports.getParentPath = getParentPath;
module.exports.getPathParts = getPathParts;
module.exports.pathCombine = pathCombine;
module.exports.getDisplayFileSize = getDisplayFileSize;
module.exports.PATH_SEPARATOR = PATH_SEPARATOR;
