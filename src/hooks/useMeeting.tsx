import { useMount, useUnmount } from 'ahooks';
import constant, { ERR_DEF } from '@/utils/constant';
import { Toast } from 'antd-mobile';
import { install, unInstall } from '@/utils/sdkFileHoc';
import { getUserInfo } from '@/utils/userManager';

type noop = (key?: any, a?: any) => void;
const win: any = window;

// step: 0 创建会议
const sendToUniappWithSuccess = (data: object, step: number) => {
  win.uni.postMessage({
    data: {
      type: 'success',
      step,
      data,
    },
  });
};

const sendToUniappWithFail = (sdkErr: number, others?: object) => {
  win.uni.postMessage({
    data: {
      type: 'fail',
      error: {
        code: sdkErr,
        message: ERR_DEF[sdkErr],
        others,
      },
    },
  });
};

const useInstallMeeting = (finish: noop) => {
  install(finish);
};

const useUnInstallMeeting = () => {
  unInstall();
};

const useInitialMeeting = (callback: noop, initObj?: any) => {
  win
    .CRVideo_Init({
      MSProtocol: 1, // 媒体流打洞协议，1 udp, 2 tcp 缺省为 1 tcp
      isCallSer: false, // 是否启用队列呼叫服务
    })
    .then(callback, (err: number) => {
      sendToUniappWithFail(err);
    });
};

const useObserveMeeting = (callback: noop) => {
  // 登录成功
  win.CRVideo_LoginSuccess.callback = function (UID: any, cookie: any) {
    // 登录成功，开始创建房间，见第3步
    console.log('登录成功，开始创建房间，见第3步');
    callback && callback(UID, cookie);
  };

  // 登录失败
  win.CRVideo_LoginFail.callback = function (sdkErr: number, cookie: any) {
    // 登录出错，可以弹出错误提示，或调用登录接口再次重试登录
    sendToUniappWithFail(sdkErr, { cookie });
  };

  // 登录掉线
  win.CRVideo_LineOff.callback = function (sdkErr: number) {
    // 系统掉线，可尝试重新登录，或弹出提示
    // token失效时，若没有及时更新token，系统将会强制掉线
    console.log('登录掉线');
    sendToUniappWithFail(sdkErr);
  };
};

const useLoginMeeting = (callback: noop) => {
  const { appID, appSecret, nickName, UID, userAuthCode, cookie } = getUserInfo();
  win.CRVideo_SetServerAddr(constant.CRSERVER_URL); // 云屋云服务器
  win.CRVideo_Login(appID, appSecret, nickName, UID, userAuthCode, cookie); // 使用appID+appSecret鉴权
  useObserveMeeting(callback);
};

const withCreateMeeting = () => {
  useInstallMeeting(() => {
    useInitialMeeting(() => {
      useLoginMeeting(() => {
        win.CRVideo_CreateMeeting(getUserInfo().meetSubject);
        //创建房间成功
        win.CRVideo_CreateMeetingSuccess.callback = function (meetObj: {}, cookie: any) {
          //创建房间成功，可以进入房间
          sendToUniappWithSuccess({ ...meetObj, cookie }, 0);
          console.log(meetObj, cookie);
        };
        //创建房间失败
        win.CRVideo_CreateMeetingFail.callback = function (sdkErr: number, cookie: any) {
          //创建房间失败，可以弹出错误提示
          sendToUniappWithFail(sdkErr, { cookie });
        };
      });
    });
  });
};

const enterMeetingObserve = (callback: noop) => {
  win.CRVideo_EnterMeetingRslt.callback = function (sdkErr: number) {
    if (sdkErr === 0) {
      console.log('进入房间成功，可以继续下面第5步……');
      callback && callback();
    } else {
      console.log('进入房间失败', ERR_DEF[sdkErr] || '未知错误');
      console.log('sdkErr:::::::', sdkErr);
      Toast.fail(ERR_DEF[sdkErr] || '未知错误');
    }
  };
  //监控房间掉线
  win.CRVideo_MeetingDropped.callback = function () {
    // 从房间中掉线，需要再次进入房间或退回进入房间前的状态
    console.log('从房间中掉线，需要再次进入房间或退回进入房间前的状态');
    callback('-1');
  };
};

// 进入房间 callback -1 房间掉线 重新登录
const useEnterMeeting = ({ meetId }: any, callback: noop) => {
  const { nickName, UID, cookie } = getUserInfo();
  useMount(() => {
    useInitialMeeting(() => {
      useLoginMeeting(() => {
        win.CRVideo_EnterMeeting2('52937261', UID, nickName, cookie);
        enterMeetingObserve(callback);
      });
    });
  });
};

// 初始化自身配置
const useInitConfigMyMeet = (UID: number) => {
  win.CRVideo_OpenMic(UID);
  win.CRVideo_SetVideoCfg({
    size: 2,
    ratio: 5,
  });
  // 打开房间内某个成员的摄像头（可以是自己）
  win.CRVideo_OpenVideo(UID);
  // 创建成员视频UI显示组件，并订阅某个成员的视频画面（可以是自己）
  const myVideoUI = win.CRVideo_CreatVideoObj(); // 调用接口，创建视频ui组件
  myVideoUI.setVideo(UID); // 将用户的视频画面挂载在UI组件上，传入某个成员（自己）的UID
  return myVideoUI.handler();
};

const getAllMembers = () => {
  const members = win.CRVideo_GetAllMembers();
  return members;
};

export {
  useInstallMeeting,
  useUnInstallMeeting,
  useInitialMeeting,
  useLoginMeeting,
  withCreateMeeting,
  useEnterMeeting,
  useInitConfigMyMeet,
  getAllMembers,
};
