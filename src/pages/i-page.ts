export class IPage {
    key?: string
    regexp?: RegExp
    name?: string
    constructor(obj: {
        key: string, regexp: {
            pattern: string, modifiers?: string
        }, name: string
    }) {
        this.key = obj.key
        this.regexp = new RegExp(obj.regexp.pattern, obj.regexp.modifiers)
        this.name = obj.name
    }
}