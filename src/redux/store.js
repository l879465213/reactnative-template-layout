import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import dialog from './dialog/DialogReducer';
import user from './user/UserReducer';
import loading from './loading/LoadingReducer';
import keyboard from './keyboard/KeyboardReducer';
import chat from './chat/ChatReducer';

const appReducer = combineReducers({
  user: user,
  loading: loading,
  chat: chat,
  keyboard: keyboard,
  dialog: dialog,
});

const rootReducer = (state, action) => {
  if (action.type === 'clear') {
    state = {};
  }
  return appReducer(state, action);
};
export default createStore(rootReducer, {}, applyMiddleware(thunk));
