import { IPage } from './i-page';
export class ISetting {
    key: string
    page: IPage
    data: string[]
    constructor(obj: ISetting) {
        this.key = obj.key;
        this.page = obj.page;
        this.data = obj.data;
    }
}