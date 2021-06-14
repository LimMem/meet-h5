import { useState, useRef, useEffect } from 'react';
import { useMount } from 'ahooks';

const useVisible = (close: boolean) => {
    const [visible, setVisible] = useState(true);
    const timeoutRef = useRef<{ second: number, timer: NodeJS.Timeout | null }>({
        second: 10,
        timer: null
    });
    
    console.log('tag', close)
    useEffect(() => {
        setVisible(close);
    }, [close]);

    const clearTimerOut = () => {
        if (timeoutRef.current.timer) {
            clearInterval(timeoutRef.current.timer);
            timeoutRef.current.timer = null;
        }
    }
    const startListenTimer = () => {
        if (timeoutRef.current.timer) {
            return timeoutRef.current.timer;
        }
        timeoutRef.current.timer = setInterval(() => {
            if (timeoutRef.current.second === 0) {
                setVisible(false);
                timeoutRef.current.second = 10;
            } else {
                timeoutRef.current.second -= 1;
            }
        }, 1000);

    };

    useEffect(() => {
        if (visible) {
            startListenTimer();
        } else {
            clearTimerOut();
        }
    }, [visible]);

    useMount(() => {
        startListenTimer();
    });
    return visible;
};

export {
    useVisible
}