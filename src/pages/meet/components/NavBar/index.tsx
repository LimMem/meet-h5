import React, { FC, useRef } from 'react';
import classnames from 'classnames';
import styles from './index.less';
import { IconInfo, IconExit, IconSwitchCamera, IconReceiver } from '@/asset';
import { useDuration } from '@/hooks/useDate';

interface NavBarProps {
  meetName: string;
  meetBegin: string;
  visible?: boolean;
}

const NavBar: FC<NavBarProps> = ({ meetName, meetBegin, visible }) => {
  const ref = useRef<HTMLDivElement>(null);
  const duration = useDuration(meetBegin);
  const LeftItems = () => (
    <div className={styles.leftItems}>
      <img src={IconSwitchCamera} alt="" />
      <img src={IconReceiver} alt="" />
    </div>
  );
  const RightItems = () => (
    <div className={styles.rightItems}>
      <img src={IconExit} alt="" />
    </div>
  );
  const TitleView = () => (
    <div className={styles.titleView}>
      <div className={styles.titleViewHeader}>
        <span>{meetName}</span>
        <img src={IconInfo} alt="" />
      </div>
      <div>{duration}</div>
    </div>
  );
  return (
    <div className={classnames(styles.navbar, { [styles.hidden]: !visible })} ref={ref}>
      <LeftItems />
      <TitleView />
      <RightItems />
    </div>
  );
};

export default NavBar;
