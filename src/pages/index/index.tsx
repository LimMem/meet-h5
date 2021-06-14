import React, { FC, useEffect, useState } from 'react';
import { useRequest } from 'alita';
import { query } from './service';
import styles from './index.less';
import ActivityIndicator from '@/components/ActivityIndicator';
import { withCreateMeeting, useUnInstallMeeting, useInitialMeeting } from '@/hooks/useMeeting';
import { getUserInfo } from '@/utils/userManager';


interface HomePageProps {}

const HomePage: FC<HomePageProps> = () => {
  // const [loading, setLoading] = useState(true);
  useEffect(() => {
    withCreateMeeting({
      isRegular: '1',
      meetSubject: '1'
    });
    return () => {};
  }, []);
  useUnInstallMeeting();
  return (
    <div className={styles.center}>
      {JSON.stringify(getUserInfo())}
      {/* <ActivityIndicator animating={loading}/> */}
    </div>
  );
};

export default HomePage;
