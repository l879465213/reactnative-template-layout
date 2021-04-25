import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import fonts from '../../libs/fonts';
import image from '../../libs/image';
import TextWrap from '../text-wrap/TextWrap';

export default function CheckBox({
  checked,
  onCheckedChange,
  style,
  bold,
  label,
  border,
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        onCheckedChange(!checked);
      }}
      style={[styles.root, style]}>
      <Image
        source={checked ? image.checkboxOn : image.checkboxOff}
        style={styles.check}
      />
      <TextWrap
        font={bold ? fonts.robotoMedium : fonts.robotoRegular}
        style={[
          styles.label,
          bold && {color: '#222'},
          border && {
            borderBottomWidth: 1,
            borderBottomColor: '#777',
          },
        ]}>
        {label}
      </TextWrap>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row',
  },
  check: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 14,
    lineHeight: 19,
    color: '#777777',
  },
});
