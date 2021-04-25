import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import TextWrap from '../../components/text-wrap/TextWrap';
import fonts from '../../libs/fonts';
import image from '../../libs/image';

export default function MenuItem({onPress, label, last}) {
  return (
    <TouchableOpacity
      style={[styles.root, last && {borderBottomWidth: 0}]}
      onPress={onPress}>
      <TextWrap style={styles.label} font={fonts.robotoMedium}>
        {label}
      </TextWrap>
      <Image style={styles.icon} source={image.arrow_right} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 15,
    lineHeight: 18,
    color: '#222222',
  },
  icon: {
    tintColor: '#777777',
    width: 17,
    height: 17,
    resizeMode: 'contain',
  },
});
