import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import fonts from '../../libs/fonts';
import image from '../../libs/image';
import {screenWidth} from '../../services/util';
import TextWrap from '../text-wrap/TextWrap';

export default function NoFound({message}) {
  return (
    <View style={styles.root}>
      <Image source={image.nodata} style={styles.nodata} />
      <TextWrap style={styles.text} font={fonts.barlowMedium}>
        {message || 'No results...'}
      </TextWrap>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '40%',
  },
  nodata: {
    width: screenWidth / 10,
    height: screenWidth / 10,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    marginTop: 16,
    color: '#222',
  },
});
