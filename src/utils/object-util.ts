export function deepCopy<T>(source: T): T {
    switch (type(source)) {
        case 'object':
            return copyObject(source as object) as T;
        case 'array':
            return copyArray(source as []) as T;
        case 'other':
            return source;
    }
}

function type(any: any): 'object' | 'array' | 'other' {
    if (Array.isArray(any)) {
        return 'array';
    }
    if (any !== null && typeof any === 'object') {
        return 'object';
    }
    return 'other';
}

function copyArray<T>(source: T[]): T[] {
    let target: T[] = [];
    source.forEach((value, index) => {
        target[index] = deepCopy(value);
    })
    return target;
}

function copyObject<T extends object>(source: T): T {
    let target: any = {};
    Object.keys(source).forEach(key => {
        target[key] = deepCopy((source as any)[key]);
    });
    return target;
}

export function copyProperties(source: any, target: any, copyType: 'smooth' | 'force' | 'smooth-append' | 'force-append' = 'smooth') {
    Object.keys(source).forEach(key => {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
            switch (copyType) {
                case 'smooth':
                    break;
                case 'force':
                    target[key] = source[key];
                    break;
                case 'smooth-append':
                    switch (type(target[key])) {
                        case 'object':
                            copyProperties(source[key], target[key], copyType);
                            break;
                    }
                    break;
                case 'force-append':
                    switch (type(target[key])) {
                        case 'object':
                            copyProperties(source[key], target[key], copyType);
                            break;
                        case 'array':
                            target[key] = source[key];
                            break;
                        case 'other':
                            target[key] = source[key];
                            break;
                    }
                    break;
            }
        } else {
            target[key] = source[key];
        }
    });
}