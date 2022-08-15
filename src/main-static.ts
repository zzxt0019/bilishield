import {v4 as uuidV4} from "uuid";

export const BOX_CLASS: string = 'b' + uuidV4().replaceAll('-', '')
export const MAIN_CLASS: string = 'm' + uuidV4().replaceAll('-', '')
export const APP_ID: string = 'a' + uuidV4().replaceAll('-', '')
export const BOX_STYLE_ID: string = 'b' + uuidV4().replaceAll('-', '')
export const ANTD_STYLE_ID: string = 'b' + uuidV4().replaceAll('-', '')
export const DISPLAY_CLASS: string = 'd' + uuidV4().replaceAll('-', '')
export const DISPLAY_STYLE_ID: string = 'ABCDEFG'
// export const DISPLAY_STYLE_ID: string = 'd' + uuidV4().replaceAll('-', '')
export type displayType = 'display' | 'debug'
export const data: { display: string, debug: string } = {display: '', debug: ''}