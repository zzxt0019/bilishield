import {PageData} from "@/configure/page";

type DataType = {
    page: PageData,
}

export interface BaseData {
    key: string
}

export function GmGetData<T extends keyof DataType>(key: T): DataType[T][] {
    switch (key) {
        case 'page':
            return GM_getValue<PageData[]>(key, []) as never
    }
    return undefined as never
}

export function GmAddData<T extends keyof DataType>(key: T, ...newData: DataType[T][]) {
    let oldData: DataType[T][] = GM_getValue(key, [])
    let oldKeys = new Set(oldData.map(datum => datum.key));
    oldData.push(...newData.filter(datum => !oldKeys.has(datum.key)));
    GM_setValue(key, oldData);
}

export function GmDelData<T extends keyof DataType>(key: T, ...data: (DataType[T] | string)[]) {
    let delKeys = new Set(data.map(item => {
        if (typeof item !== 'string') {
            return item.key
        } else {
            return item;
        }
    }));
    let oldData: DataType[T][] = GM_getValue(key, []);
    let deletedData = oldData.filter(datum => !delKeys.has(datum.key));
    GM_setValue(key, deletedData);
}
