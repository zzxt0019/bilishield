import { SpecialPage } from '../spceial-page';

export class BaiduPage extends SpecialPage {
    constructor() {
        super({
            key: 'baidu',
            name: '百度',
            regexp: {
                pattern: 'baidu.com'
            }
        })
    }
    isCurrent(): boolean {
        return this.regexp.test(location.href)
    }
}