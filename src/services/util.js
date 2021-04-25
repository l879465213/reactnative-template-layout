import {Dimensions, Linking, Platform} from 'react-native';
import moment from 'moment-timezone';
import SimpleToast from 'react-native-simple-toast';
export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;
export const isIos = Platform.OS === 'ios';
export const validationEmail = (email) => {
  return email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
};

export const isVideo = (path) => {
  if (path) {
    const ext = path.split('.').pop();
    if (['mp4', 'avi', 'mov'].includes(ext)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const getFileData = (createdAt) => {
  if (!createdAt) {
    return '';
  }

  return moment(createdAt).add(3, 'months').format('YY. MM. DD');
};

export const parseName = (f, l) => {
  return `${f || ''}${l ? ' ' + l : ''}`;
};
export const calculateTimer = (second) => {
  if (!second) {
    return '00:00';
  }

  if (typeof second === 'string') {
    second = parseInt(second);
  }
  const minute = Math.floor(second / 60);
  const second2 = Math.floor(second % 60);

  let mstr = '';
  let sstr = '';
  if (minute < 10) {
    mstr = '0' + minute;
  } else {
    mstr = minute.toString();
  }
  if (second2 < 10) {
    sstr = '0' + second2;
  } else {
    sstr = second2.toString();
  }

  return mstr + ':' + sstr;
};

export const splitMatchString = (target, value, mask) => {
  if (target && value) {
    let target2 = String(target).toLowerCase();
    let value2 = String(value).toLowerCase();

    const startIndex = target2.indexOf(value2);
    const endIndex = startIndex + value2.length;

    const s = [];
    const end = [];
    const match = [];
    target.split('').map((x, i) => {
      if (i >= startIndex && i < endIndex) {
        match.push(x);
      } else if (i < startIndex) {
        s.push(x);
      } else if (i >= endIndex) {
        end.push(x);
      }
    });
    const result = [s.join(''), match.join(''), end.join('')];
    return result;
  } else {
    return [];
  }
};

export const checkStringMatch = (i1, i2, include) => {
  if (i1 && i2) {
    if (include) {
      if (
        String(i1)
          .toLowerCase()
          .trim()
          .includes(String(i2).toLowerCase().trim())
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      if (String(i1).toLowerCase().trim() === String(i2).toLowerCase().trim()) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
};

export const formatPhone = (f) => {
  if (!f) {
    return '';
  }
  if (f.match(/^\d{11}$/)) {
    return f.substr(0, 3) + '-' + f.substr(3, 4) + '-' + f.substr(7, 4);
  }
  const f_val = f.replace(/\D[^\.]/g, '');
  return f_val.slice(0, 3) + '-' + f_val.slice(3, 6) + '-' + f_val.slice(6);
};
export const openMail = () => {
  Linking.openURL(`mailto:`);
};
export const toast = (message) => {
  SimpleToast.show(message);
};

export const getAgeFromMoment = (birthday, format, isMan) => {
  if (!birthday) {
    throw '계산 오류.';
  }
  const nowTime = moment();
  const birthTime = moment(birthday, format);

  if (isMan) {
    return '';
  }

  if (!birthTime) {
    return '';
  }

  if (birthTime.invalidAt() === 1) {
    return '';
  }
  return nowTime.get('years') - birthTime.get('years') + 1;
};

export const formatTime = (time, format) => {
  if (!time) {
    return '';
    time = moment();
  } else {
    time = moment(time);
  }
  time = time.tz('Asia/Seoul');
  switch (format) {
    case 'ymd':
      return time.format('YYYYMMDD');
    case 'date':
      return time.format('YYYY-MM-DD');
    case 'date-time':
      return time.format('YYYY-MM-DD HH:mm');
    default:
      return time.format(format);
  }
};

export const formatLastMessageTime = (time) => {
  if (!time) {
    return '';
  }

  if (moment().format('YYYYMMDD') === moment(time).format('YYYYMMDD')) {
    return formatTime(time, 'hh:mm A');
  } else if (moment().format('YYYYMM') === moment(time).format('YYYYMM')) {
    return formatTime(time, 'MM-DD hh:mm A');
  } else {
    return formatTime(time, 'YYYY-MM-DD hh:mm A');
  }
};
export function generateDigit(n) {
  var add = 1,
    max = 12 - add; // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

  if (n > max) {
    return generate(max) + generate(n - max);
  }

  max = Math.pow(10, n + add);
  var min = max / 10; // Math.pow(10, n) basically
  var number = Math.floor(Math.random() * (max - min + 1)) + min;

  return ('' + number).substring(add);
}
export function numFormat(nStr) {
  if (!nStr) {
    nStr = '0';
  }
  nStr += '';
  let x = nStr.split('.');
  let x1 = x[0];
  let x2 = x.length > 1 ? '.' + x[1] : '';
  let rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
}
