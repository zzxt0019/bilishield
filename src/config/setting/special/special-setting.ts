import {CheckType} from "@/config/rule/checker";

export abstract class SpecialSetting {
    abstract get(key: string): () => Promise<string[]>

    abstract set(key: string): (data: any) => void

    abstract add(key: string): (data: any) => void

    abstract del(key: string): (data: any) => void

    abstract type(key: string): () => CheckType
}