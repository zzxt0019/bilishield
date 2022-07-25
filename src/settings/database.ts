import * as Cards from './cards'
import * as Matches from './matches'
import * as UUs from './uids-usernames'
/**
 * 计数器
 */
class CountDown {
    static _count: number = 0
    count: number
    constructor() {
        this.count = ++CountDown._count
    }
    isCurrent(): boolean {
        return this.count === CountDown._count
    }
}
let fileText: string
export function readFile(file: File): void {
    let reader = new FileReader()
    reader.readAsText(file, 'utf-8')
    let countDown = new CountDown()
    reader.onload = () => {
        let text = reader.result as string
        if (countDown.isCurrent()) {
            fileText = text
            console.log(fileText)
        }
    }
}
export function upload(): void {
    let json = JSON.parse(fileText) as any;
    UUs.deleteUids(UUs.fetchUUs().join(' '));
    GM_setValue('cards',json.cards);
    GM_setValue('uids', json.uids);
    GM_setValue('matches', json.matches);
}
export function appendUpload(): void {
    let json = JSON.parse(fileText) as any
    Cards.addCards(json.cards.join(' '))
    UUs.addUids(json.uids.join(' '))
    Matches.addMatches(json.matches.join(' '))

}
export function fetchConfig(): object {
    return {
        uids: GM_getValue('uids', []),
        matches: GM_getValue('matches', []),
        cards: GM_getValue('cards', [])
    }
}
export function download() {
    const a = document.createElement('a');
    const file = new Blob([JSON.stringify(fetchConfig())], { type: 'text/plain' })
    a.href = URL.createObjectURL(file);
    a.download = 'bilishild_config';
    a.click();
    URL.revokeObjectURL(a.href);
}