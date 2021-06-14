import React, { FC, useRef, useEffect, useState } from 'react';
import styles from './index.less';
import { IconVoice, IconVoiceClose } from '@/asset/index';
import { getUserInfo } from '@/utils/userManager';

interface MemberItemProps {
  userID: string;
  audioStatus: string;
  nickname: string;
  videoStatus: string;
}

const win: any = window;
const MemberItem: FC<MemberItemProps> = (props) => {
  const { nickname, userID, audioStatus, videoStatus } = props;
  const [voiceStatus, setVoiceStatus] = useState(audioStatus);
  const myUid = getUserInfo().UID;
  const ref = useRef<HTMLDivElement>(null);
  const setVideoView = (newStatus?: string) => {
    const otherVideoUI = win.CRVideo_CreatVideoObj();
    otherVideoUI.setVideo(userID);
    const div = otherVideoUI.handler();
    if (ref.current?.childNodes.length === 0) {
      ref.current?.appendChild(div);
    }
  };

  useEffect(() => {
    setVideoView(videoStatus);
    win.CRVideo_AudioStatusChanged.callback = function (
      UID: string,
      oldStatus: any,
      newStatus: React.SetStateAction<string>,
    ) {
      if (UID == userID) {
        setVoiceStatus(newStatus);
      }
    };
  }, []);
  return (
    <div className={styles.memberItem}>
      <div className={styles.memberVideo} ref={ref}></div>
      <div className={styles.userInfo}>
        <span>{nickname}</span>
        <img src={voiceStatus === '3' ? IconVoice : IconVoiceClose} alt="" />
      </div>
    </div>
  );
};

export default MemberItem;
