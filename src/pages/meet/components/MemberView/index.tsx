import React, { FC, useEffect, useState } from 'react';
import MemberItem from '../MemberItem';
import styles from './index.less';

interface MemberVideoProps {
  members: any[];
}

const MemberVideo: FC<MemberVideoProps> = (props) => {
  const { members } = props;
  const [_members, set_members] = useState<any>([]);

  useEffect(() => {
    set_members(members);
  }, [JSON.stringify(members)]);

  return (
    <div className={styles.memberVideo}>
      {members.map((item) => {
        return (
          <div className={styles.memberItem} key={item.userID}>
            <MemberItem {...item}></MemberItem>
          </div>
        );
      })}
    </div>
  );
};

export default MemberVideo;
