import constant from './constant';

const getUserInfo = () => {
    const item = localStorage.getItem(constant.userKey) || '{}';
    return JSON.parse(item);
}

const setUserInfo = (value = '') => {
    localStorage.setItem(constant.userKey, value);
}

export {
    getUserInfo,
    setUserInfo
}