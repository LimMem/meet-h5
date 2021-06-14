import { withCreateMeeting } from "./hooks/useMeeting";
import { setUserInfo } from "./utils/userManager";

const win: any = window;

win.setUserInfo = (u: any) => {
    setUserInfo(u);
}

win.createMeeting = (u: any) => {
    console.log('web', u);
    win.setUserInfo(u);
    withCreateMeeting();
}