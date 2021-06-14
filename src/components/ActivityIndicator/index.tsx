import React, { FC } from 'react';
import { ActivityIndicator } from 'antd-mobile'
import styles from './index.less'

interface ActivityIndicatorViewProps {
    animating?: boolean;
    text?: string;
}

const ActivityIndicatorView: FC<ActivityIndicatorViewProps> = ({ animating = true, text = '加载中...' }) => {
    return <div className={styles.activityIndicatorView}>
        <ActivityIndicator
            text="加载中..."
            size='small'
            animating={animating}
        />
    </div>
}

export default ActivityIndicatorView;