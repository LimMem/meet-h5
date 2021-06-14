import { useMainScreen } from './useMain';
import { useMount } from 'ahooks';
import React, { FC, useRef, LegacyRef } from 'react';
import styles from './index.less';

interface MyVideoProps {
  onClick?: () => void;
}

const MyVideo: React.ForwardRefRenderFunction<HTMLDivElement, MyVideoProps> = (
  props: MyVideoProps,
  refs: React.LegacyRef<HTMLDivElement>,
) => {
  const { onClick } = props;
  const brandRef = useRef();
  useMainScreen(brandRef.current);
  return <div className={styles.video} ref={brandRef} onClick={onClick}></div>;
};

export default React.forwardRef(MyVideo);
