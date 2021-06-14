import React, { FC, useState, useEffect, useRef } from 'react';
import classnames from 'classnames';
import { getUserInfo } from '@/utils/userManager';
import styles from './index.less';

interface ChartsViewProps {
  show?: boolean;
  onClose?: () => void;
}

const win: any = window;

const ChartsView: FC<ChartsViewProps> = ({ show, onClose }) => {
  const { cookie } = getUserInfo();
  const [value, setValue] = useState('');
  const [chartList, setChartList] = useState<any[]>([]);
  const contentViewRef = useRef(null);
  const sendMsg = (value: string) => {
    if (value.length > 0) {
      win.CRVideo_SendMeetingCustomMsg(value, cookie);
      addChartsWithUser(value, '我', true);
    }
    setValue('');
  };

  const scrollToLastView = () => {
    setTimeout(() => {
      if (contentViewRef.current) {
        const contentView: HTMLDivElement = contentViewRef.current!;
        const lastChild = contentView.lastChild as HTMLDivElement | null;
        lastChild?.scrollIntoView();
      }
    }, 30);
  };

  const addChartsWithUser = (stringMsg: string, nickname: string, isMe: boolean) => {
    const tempCharts = JSON.parse(JSON.stringify(chartList));
    tempCharts.push({
      isMe,
      stringMsg,
      nickname,
    });
    setChartList(tempCharts);
    scrollToLastView();
  };

  useEffect(() => {
    win.CRVideo_SendMeetingCustomMsgRslt.callback = function (sdkErr: number, cookie: any) {};
    win.CRVideo_NotifyMeetingCustomMsg.callback = function (UID: any, stringMsg: string) {
      const { nickname } = win.CRVideo_GetMemberInfo(UID);
      if (getUserInfo().UID !== UID) {
        addChartsWithUser(stringMsg, nickname, false);
      }
    };
  }, []);

  const OtherCell = ({ stringMsg = '', nickname = '' }) => (
    <div className={styles.otherCell}>
      <div className={styles.userName}>{nickname}</div>
      <div className={styles.chartContent}>
        <div>{stringMsg}</div>
      </div>
    </div>
  );
  const MeCell = ({ stringMsg = '', nickname = '' }) => (
    <div className={styles.meCell}>
      <div className={styles.userName}>{nickname}</div>
      <div className={styles.chartContent}>
        <div>{stringMsg}</div>
      </div>
    </div>
  );
  return (
    <div className={classnames(styles.chartsView, { [styles.hidden]: !show })}>
      <div className={styles.titleView}>
        <div className={styles.titleItems} onClick={onClose}>
          取消
        </div>
        <div className={styles.title}>聊天</div>
        <div className={styles.titleItems}></div>
      </div>
      <div className={styles.contentView} ref={contentViewRef}>
        {chartList.map((item) => {
          return item.isMe ? <MeCell {...item} /> : <OtherCell {...item} />;
        })}
      </div>
      <div className={styles.footer}>
        <textarea
          value={value}
          className={styles.textArea}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              e.preventDefault();
              sendMsg((e.target as any).value);
            }
          }}
        ></textarea>
      </div>
    </div>
  );
};

export default ChartsView;
