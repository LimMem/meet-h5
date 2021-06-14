import React, { FC, useEffect } from 'react';
import { useSetState } from 'ahooks';
import { useVisible } from '@/hooks/useVisible';
import { useEnterMeeting, getAllMembers } from '@/hooks/useMeeting';
import { ControlRoom, ToolBar, NavBar } from './components';
import styles from './index.less';
import MeetingHOC from '@/components/MeetingHOC';

interface MeetPageProps {
  location: any;
}

const MeetPage: FC<MeetPageProps> = ({ location }) => {
  const { query = {} } = location;
  const [state, setState] = useSetState({
    meetParams: JSON.parse(query.item || '{}'),
    panelCount: 0,
    visible: true,
  });

  const visible = useVisible(state.visible);
  useEffect(() => {
    setState({ visible: visible });
  }, [visible]);
  useEnterMeeting(state.meetParams, (errCode) => {
    if (!errCode) {
      // 成功
      // const { UID } = getUserInfo();
      // const myVideoDom = useInitConfigMyMeet(UID);
      // videoRef.current?.appendChild(myVideoDom);

      setState({
        // 成员列表页数
        panelCount: Math.ceil(getAllMembers().length / 6),
      });
      return;
    }
    if (errCode === -1) {
      // 掉线
      console.log('掉线');
    }
  });
  return (
    <div className={styles.center}>
      <NavBar
        meetName={state.meetParams?.name}
        meetBegin={state.meetParams?.meetBegin}
        visible={visible}
      />
      <ControlRoom
        onClick={() => {
          setState({ visible: !visible });
        }}
      />
      <ToolBar managerMember={() => {}} visible={visible} />
    </div>
  );
};

export default MeetingHOC({})(MeetPage);
