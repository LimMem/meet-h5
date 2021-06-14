import { getUserInfo } from '@/utils/userManager';
import { Toast, ActionSheet } from 'antd-mobile';
import { useSetState } from 'ahooks';
import ChartsView from '../ChartsView';
import classnames from 'classnames';
import React, { FC, useRef, useEffect } from 'react';
import styles from './index.less';
import moreData from './moreData';
import {
  IconCamera,
  IconShared,
  IconVoice,
  IconPeople,
  IconMore,
  IconCloseCarmea,
  IconClosevoice,
} from '@/asset';

const win: any = window;
interface ToolBarProps {
  managerMember: () => void;
  visible: boolean;
}

const ToolBar: FC<ToolBarProps> = ({ managerMember, visible }) => {
  const myUid = getUserInfo().UID;
  const [state, setState] = useSetState({
    isVoiceOpen: win.CRVideo_GetMemberInfo(myUid).audioStatus === 3,
    isVideoOpen: win.CRVideo_GetMemberInfo(myUid).videoStatus === 3,
    showMore: false,
    showCharts: false,
  });
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    win.CRVideo_AudioStatusChanged.callback = function (UID, oldStatus, newStatus) {
      if (UID == myUid) {
        setState({
          isVoiceOpen: newStatus === 3,
        });
      }
    };
    win.CRVideo_VideoStatusChanged.callback = function (UID, oldStatus, newStatus) {
      if (UID == myUid) {
        setState({
          isVideoOpen: newStatus === 3,
        });
      }
    };

    return () => {};
  }, []);
  const toggleAudio = () => {
    // 0	音频状态未知 1	没有麦克风设备 2	麦克风处于关闭状态（软开关） 3	麦克风处于打开状态（软开关） 4	向服务器发送打开消息
    const status = win.CRVideo_GetAudioStatus(myUid);
    switch (status) {
      case 0:
      case 2:
        win.CRVideo_OpenMic(myUid);
        break;
      case 3:
        win.CRVideo_CloseMic(myUid);
        break;
      default:
        Toast.info('没有可打开的音频设备');
        break;
    }
  };

  const toggleVideo = () => {
    // 0	视频状态未知 1	没有视频设备 2	视频处于关闭状态（软开关） 3	视频处于打开状态（软开关） 4	向服务器发送打开消息中
    const status = win.CRVideo_GetVideoStatus(myUid);
    switch (status) {
      case 0:
      case 2:
        win.CRVideo_OpenVideo(myUid);
        break;
      case 3:
        win.CRVideo_CloseVideo(myUid);
        break;
      default:
        Toast.info('没有可打开的视频设备');
        break;
    }
  };

  const toggleShareScreen = () => {
    console.log('toggleShareScreen');
    ActionSheet.showActionSheetWithOptions(
      {
        options: ['共享屏幕', '共享白板', '取消'],
        cancelButtonIndex: 2,
        maskClosable: true,
      },
      (buttonIndex) => {
        console.log(buttonIndex);
      },
    );
  };

  const onMoreClick = () => {
    setState({ showMore: !state.showMore });
  };

  useEffect(() => {
    if (!visible) {
      setState({ showMore: false });
    }
  }, [visible]);

  return (
    <>
      <div className={classnames(styles.toolBar, { [styles.hidden]: !visible })} ref={ref}>
        <div className={styles.toolItem} onClick={toggleAudio}>
          <img src={state.isVoiceOpen ? IconVoice : IconClosevoice} alt="" />
          <div>{state.isVoiceOpen ? '关闭麦克风' : '麦克风'}</div>
        </div>
        <div className={styles.toolItem} onClick={toggleVideo}>
          <img src={state.isVideoOpen ? IconCamera : IconCloseCarmea} alt="" />
          <div>{state.isVideoOpen ? '关闭摄像头' : '摄像头'}</div>
        </div>
        <div className={styles.toolItem} onClick={toggleShareScreen}>
          <img src={IconShared} alt="" />
          <div>共享</div>
        </div>
        <div className={styles.toolItem} onClick={managerMember}>
          <img src={IconPeople} alt="" />
          <div>参会者</div>
        </div>
        <div className={styles.toolItem} onClick={onMoreClick}>
          <img src={IconMore} alt="" />
          <div>更多</div>
        </div>
      </div>
      {state.showMore && visible && (
        <div className={classnames(styles.moreView)}>
          {moreData.map((item) => {
            return (
              <div
                key={item.id}
                className={styles.moreItem}
                onClick={() => {
                  switch (item.title) {
                    case '聊天':
                      setState({ showCharts: true });
                      break;

                    default:
                      break;
                  }
                }}
              >
                <img src={item.icon} alt="" />
                <div>{item.title}</div>
              </div>
            );
          })}
        </div>
      )}
      <ChartsView show={state.showCharts} onClose={() => setState({ showCharts: false })} />
    </>
  );
};

export default ToolBar;
