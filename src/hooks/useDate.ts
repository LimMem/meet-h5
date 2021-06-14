import React, { FC, useRef } from 'react';
import moment from 'moment';
import { useMount, useSetState, useUnmount } from 'ahooks';

const useDuration = (begin: string) => {
    const [state, setState] = useSetState({ duration: '' });
    const timerRef = useRef<any>();
    const durationString = (timeStamp: number) => {
        const now = moment.now();
        const duration = now - timeStamp;
        let days = Math.floor(duration / (24 * 3600 * 1000));
        let leave1 = duration % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
        let hours = Math.floor(leave1 / (3600 * 1000));
        let leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
        let minutes = Math.floor(leave2 / (60 * 1000));
        let leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
        let seconds = Math.floor(leave3 / 1000);
        if (days >= 1) {
            setState({
                duration: `${days}天${hours}:${minutes}:${seconds}`
            });
        } else {
            setState({
                duration: `${hours}:${minutes}:${seconds}`
            });
        }
    };

    useMount(() => {
        const timeStamp = moment(begin).valueOf();
        durationString(timeStamp);
        timerRef.current = setInterval(() => durationString(timeStamp), 1000);
    });

    useUnmount(() => {
        clearInterval(timerRef.current);
    });
    return state.duration;
};

export {
    useDuration
}