export abstract class SpecialSetting {
    abstract get(key: string): () => Promise<string[]>

    abstract set(key: string): (data: any) => void

    abstract add(key: string): (data: any) => void

    abstract del(key: string): (data: any) => void
}