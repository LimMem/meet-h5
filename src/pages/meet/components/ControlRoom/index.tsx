import { useSetState } from 'ahooks';
import React, { FC, useEffect } from 'react';
import { Toast } from 'antd-mobile';
import MainView from '../MainView';
import MemberItem from '../MemberItem';
import styles from './index.less';

interface ControlRoomProps {
  onClick?: () => void;
}

const win: any = window;
const ControlRoom: FC<ControlRoomProps> = ({ onClick }) => {
  const [state, setState] = useSetState({ memberInfos: [] });
  const observeUserEnterMeeting = () => {
    win.CRVideo_UserEnterMeeting = () => {
      setState({ memberInfos: win.CRVideo_GetAllMembers() });
    };
    win.CRVideo_UserLeftMeeting.callback = function (UID: number) {
      const { nickName } = win.CRVideo_GetMemberInfo(UID);
      Toast.info(`${nickName}离开房间`);
      setState({ memberInfos: win.CRVideo_GetAllMembers() });
    };
  };
  useEffect(() => {
    observeUserEnterMeeting();
    setState({ memberInfos: win.CRVideo_GetAllMembers() });
  }, []);
  return (
    <div className={styles.controlRoom} onClick={onClick}>
      <div className={styles.mainView}>
        <div className={styles.mainScreen}>
          <MainView />
        </div>
        <div className={styles.memberControll}>
          {state.memberInfos
            .filter((item, index) => index < 2)
            .map((item) => {
              return (
                <div className={styles.memberScreen}>
                  <MemberItem {...item} />
                </div>
              );
            })}
        </div>
      </div>
      <div className={styles.otherMembers}>
        {state.memberInfos
          .filter((item, index) => index >= 2)
          .map((item) => {
            return (
              <div className={styles.otherMemberScreen}>
                <MemberItem {...item} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ControlRoom;
