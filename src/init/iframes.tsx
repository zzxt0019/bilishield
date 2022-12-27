import {Page} from "@/config/page/page";
import {createDisplayStyle} from "@/init/create-display-style";

export function iframes(pageMap: Map<string, Page>) {
    interface FrameData {
        frame: Window,
        document?: Document,
    }

    let framesData: FrameData[] = [];
    setInterval(() => {
        for (let i = 0; i < window.frames.length; i++) {
            let frame = window.frames[i];
            // 第一次
            if (!framesData[i] || framesData[i].frame !== frame) {
                let frameData: Partial<FrameData> = {};
                framesData[i] = frameData as FrameData;
                frameData.frame = frame;
            }
            // 不跨域且dom改变了
            try {
                if (frame.document && framesData[i].document !== frame.document) {
                    framesData[i].document = frame.document;
                    createDisplayStyle('hide', frame.document)
                    for (const page of pageMap.values()) {
                        page.stop()
                        page.start()
                    }
                }
            } catch (ignore) {
            }
        }
    }, 500);
}
