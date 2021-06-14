const RTCSDKV2ID = "rtcsdkv2";

const install = (onLoaded = () => { }) => {
	const rtc = document.querySelector(`#${RTCSDKV2ID}`);
	if (!rtc) {
		const scriptDom = document.createElement('script');
		scriptDom.src = './RTCSDKV2.min.js';
		scriptDom.id = RTCSDKV2ID;
		document.head.appendChild(scriptDom);
		scriptDom.onload = () => {
			typeof onLoaded === 'function' && onLoaded();
		};
	} else {
		typeof onLoaded === 'function' && onLoaded();
	}
}

const unInstall = () => {
	const rtc = document.querySelector(`#${RTCSDKV2ID}`);
	if (rtc) {
		document.head.removeChild(rtc);
	}
}

export {
	install,
	unInstall,
}