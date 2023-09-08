import {createStyle} from "@/init/create-style";

export function iframes() {
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
                    createStyle('hide', frame.document)
                    // for (const page of pageMap.values()) {
                    //     page.stop()
                    //     page.start()
                    // }
                }
            } catch (ignore) {
            }
        }
    }, 500);
}
