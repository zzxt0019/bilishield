export abstract class SP {
    abstract get(key: string): () => string[]
    abstract set(key: string): (data: any) => void
    abstract add(key: string): (data: any) => void
    abstract del(key: string): (data: any) => void
}