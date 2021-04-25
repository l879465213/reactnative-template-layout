import {isIos} from '../services/util';
let devMode = true;

let devIp = isIos ? '' : '10.0.2.2';

export default {
  devMode,
  androidPushChannel: '',
  packageName: isIos
    ? ''
    : '',
  version: '1.0.0',
  apiUrl: devMode
    ? // ? 'http://' + devIp + ':8081'
      'http://' + devIp + ':8000'
    : '',
  fileApiUrl: devMode
    ? // ? 'http://' + devIp + ':8081'
      'http://' + devIp + ':8000'
    : '',
  dialogZindex: 10,
};
