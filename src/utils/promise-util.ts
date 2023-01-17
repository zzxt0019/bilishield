export function abortPromise<Result>(p1: Promise<Result>): [Promise<Result>, (reason?: any) => void] {
    let abort: any
    const p2 = new Promise<Result>((resolve, reject) => (abort = reject))
    const p = Promise.race([p1, p2])
    return [p, abort]
}

export function finalPromise<Result>(p: Promise<Result>, key?: string): Promise<Result> {
    if (!map.has(key)) {
        map.set(key, []);
    }
    let promise;
    while (promise = map.get(key)?.pop()) {
        promise[1]('too late');
    }
    promise = abortPromise(p);
    map.get(key)?.push(promise);
    return promise[0];
}

const map: Map<string | undefined, [Promise<any>, (reason?: any) => void][]> = new Map();