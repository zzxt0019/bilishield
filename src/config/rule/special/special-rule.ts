
export abstract class SpecialRule {
    abstract pageKey: string
    abstract spCheckers: {
        mainSelector: string,
        bingo: (element: Element) => Promise<boolean>
    }[]
}