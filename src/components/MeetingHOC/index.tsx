import { useMount } from 'ahooks';
import React, { FC, useState } from 'react';
import { install } from '@/utils/sdkFileHoc';
import ActivityIndicator from '@/components/ActivityIndicator'

interface MeetingAPIHOC { }

interface WrapperHocProps { };

export default (hocProps: WrapperHocProps) => (WrappedComponent: any) => {
    const MeetingAPIHOC: FC<MeetingAPIHOC> = props => {
        const [isLoaded, setIsLoaded] = useState(false);
        useMount(() => {
            install(() => {
                setIsLoaded(true);
            });
        });
        return isLoaded ? <WrappedComponent {...props}/> : <ActivityIndicator />;
    };
    return MeetingAPIHOC;
}