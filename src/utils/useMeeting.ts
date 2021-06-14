/* eslint-ignore */
import $constant, { ERR_DEF } from '@/utils/constant.js';
import { install, unInstall } from './sdkFileHoc.js';
import { getLoginInfo, getUserInfo } from '@/utils/hooks.js'


const mConsole = {
	log:(...e) => {
		console.log(...e);
	}
}

class BaseMeeting {
	// 会议初始化成功
	initSuccess = () => {}
	constructor(...arg) {
		install(...arg);
	}
	unInstall(){
		unInstall();
	}
}

/**
 * 会议管理类，通过本类来操作会议
 */
class MeetingManager extends BaseMeeting {
	constructor(...arg) {
	    super(() => {
			this.initialVideo();
		}, ...arg);
	}
	
	initialVideo(initObj){
		CRVideo_Init(initObj).then(res => {
			this.initSuccess(res);
			uni.showToast({
				icon:"success",
				title: res
			})
			mConsole.log('会议初始化成功:', res);
		}, err => {
			mConsole.log('会议初始化失败:', ERR_DEF[err]);
			uni.showToast({
				icon:"none",
				title: ERR_DEF[err]
			})
		});
	}
	
	loginVideo(){
		// 设置服务器
		CRVideo_SetServerAddr($constant.SERVER_ADDR);  // 云屋云服务器
		
		const { appID, appSecret } = getLoginInfo();
		mConsole.log(getUserInfo());
		
		CRVideo_Login(appID, appSecret, nickName, UID, userAuthCode, cookie);  // 使用appID+appSecret鉴权
	}
}


export default MeetingManager;

function CRVideo_Init(initObj: any) {
    throw new Error('Function not implemented.');
}


function CRVideo_SetServerAddr(SERVER_ADDR: any) {
    throw new Error('Function not implemented.');
}


function CRVideo_Login(appID: any, appSecret: any, nickName: any, UID: any, userAuthCode: any, cookie: any) {
    throw new Error('Function not implemented.');
}


function nickName(appID: any, appSecret: any, nickName: any, UID: any, userAuthCode: any, cookie: any) {
    throw new Error('Function not implemented.');
}


function UID(appID: any, appSecret: any, nickName: any, UID: any, userAuthCode: any, cookie: any) {
    throw new Error('Function not implemented.');
}


function userAuthCode(appID: any, appSecret: any, nickName: any, UID: any, userAuthCode: any, cookie: any) {
    throw new Error('Function not implemented.');
}


function cookie(appID: any, appSecret: any, nickName: any, UID: any, userAuthCode: any, cookie: any) {
    throw new Error('Function not implemented.');
}
