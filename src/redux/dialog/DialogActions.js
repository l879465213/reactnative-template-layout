export const dialogActionType = {
  openAction: 'dialog/openAction',
  openMessage: 'dialog/openMessage',
  close: 'dialog/close',
};

export const dialogError = (error, onPress) => (dispatch) => {
  dispatch({
    type: dialogActionType.openMessage,
    message:
      error.message ||
      (typeof error === 'object' ? JSON.stringify(error) : error),
    close: true,
    title: '확인',
    onPress,
  });
};

export const dialogOpenMessage = ({
  label,
  onPress,
  title = 'OK',
  message = '',
}) => (dispatch) => {
  dispatch({
    type: dialogActionType.openMessage,
    message,
    title,
    onPress,
    label,
  });
};
export const dialogOpenAction = ({
  titleColor,
  onPress,
  message,
  title = 'OK',
  cancelTitle = 'Cancel',
}) => (dispatch) => {
  dispatch({
    type: dialogActionType.openAction,
    onPress,
    message,
    titleColor,
    title,
    cancelTitle,
  });
};

export const dialogClose = () => (dispatch) => {
  dispatch({
    type: dialogActionType.close,
  });
};
