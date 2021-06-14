import { useMount } from 'ahooks';
import { IconShareScreen } from '@/asset/index';
import { getUserInfo } from '@/utils/userManager';
import { nickNameStyle } from '@/utils/nickStyle';

const mainStatus = {
    screenSharing: false,
    isVideoSharing: false
};

const win: any = window;

const useMainScreen = (dom?: HTMLDivElement) => {
    // 设置屏幕共享封面
    const setScreenSharePoster = () => {
        const screenShareObj = win.CRVideo_CreatScreenShareObj({
            poster: IconShareScreen,
        });
        screenShareObj.id('screenShareObj');
        if (dom) {
            dom.innerHTML = screenShareObj.handler();
            // ref.appendChild(screenShareObj.handler());
        }
        return screenShareObj;
    };

    // 通知受到屏幕共享
    const notifyScreenShare = () => {
        win.CRVideo_NotifyScreenShareStarted.callback = (sharer: string) => {
            const { UID } = getUserInfo();
            if (sharer !== UID) {
                mainStatus.screenSharing = true;
                const screenShareObj = setScreenSharePoster();
                screenShareObj.setVideo(sharer);
                screenShareObj.setNickNameStyle(nickNameStyle); // 设置昵称样式
                const nickName = `${win.CRVideo_GetMemberNickName(sharer)}的屏幕`;
                screenShareObj.setNickNameContent(nickName);
            }
        };
        win.CRVideo_NotifyScreenShareStopped.callback = () => {
            mainStatus.screenSharing = false;
        };
    }

    // 通知收到主视频变化
    const notifyMainVideo = () => {
        win.CRVideo_NotifyMainVideoChanged.callback = function (sharer: string) {
            const { UID } = getUserInfo();
            if (sharer !== UID) {
                mainStatus.isVideoSharing = true;
                const videoObj = win.CRVideo_CreatVideoObj();
                dom!.innerHTML = videoObj.handler();
                videoObj.setVideo(sharer);
            };
        };
        win.CRVideo_NotifyMainVideoModeChanged.callback = function (mode: number) {
            if (mode === 1) {
                // 语音激励模式
            } else if (mode === 2) {
                // 跟随演示者
            } else {
                // 跟随特定参会者
            }
        }
    };

    // 接收到某人正在说话
    const notifyVoiceView = () => {
        
    };

    // 监听管理变化
    const observeManager = () => {
        notifyScreenShare();
        notifyMainVideo();
        notifyVoiceView();
    };
    useMount(() => {
        if (dom) {
            observeManager();
        }
    });
}

export {
    useMainScreen
};