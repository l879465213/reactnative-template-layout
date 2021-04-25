import React, {useEffect} from 'react';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import TextWrap from '../../components/text-wrap/TextWrap';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import {dialogClose} from '../../redux/dialog/DialogActions';

export default function DialogMessage({}) {
  const dispatch = useDispatch();
  const {messageDialog} = useSelector((s) => s.dialog, []);

  useEffect(() => {
    if (messageDialog.open) {
      Keyboard.dismiss();
    }
  }, [messageDialog.open]);

  if (!messageDialog.open) {
    return null;
  }
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.wrap}>
        <View style={styles.dialog}>
          {Boolean(messageDialog.label) && (
            <TextWrap
              font={fonts.robotoBold}
              style={[
                styles.label,
                {
                  marginTop: messageDialog.label ? 44 : 0,
                },
              ]}>
              {messageDialog.label}
            </TextWrap>
          )}
          <TextWrap
            style={[
              styles.message,
              {
                marginTop: messageDialog.label ? 8 : 44,
              },
            ]}>
            {messageDialog.message}
          </TextWrap>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              dispatch(dialogClose());
              if (messageDialog.onPress) {
                messageDialog.onPress();
              }
            }}>
            <TextWrap font={fonts.robotoMedium} style={styles.title}>
              {messageDialog.title}
            </TextWrap>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    bottom: 0,
    zIndex: consts.dialogZindex,
  },
  wrap: {flex: 1, justifyContent: 'center'},
  dialog: {
    backgroundColor: colors.white,
    marginHorizontal: 30,
    borderRadius: 8,
  },
  message: {
    lineHeight: 21,
    fontSize: 14,
    color: '#222222',
    textAlign: 'center',
    marginBottom: 36,
    paddingHorizontal: 30,
  },
  label: {
    paddingHorizontal: 30,
    color: '#222222',
    lineHeight: 20,
    fontSize: 15,
    textAlign: 'center',
  },
  button: {
    borderTopWidth: 1,
    paddingVertical: 18,
    borderTopColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    color: '#222222',
  },
});
