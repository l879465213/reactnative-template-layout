import React, {useState} from 'react';
import {Image, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import fonts from '../../libs/fonts';
import image from '../../libs/image';
import {goBack} from '../../services/navigation';
import TextWrap from '../text-wrap/TextWrap';

export default function Topbar({title, onGoBack, options, back = true}) {
  const [optionWidth, setOptionWidth] = useState(0);
  const handleOptionLayout = (e) => {
    const {width} = e.nativeEvent.layout;
    if (width > optionWidth) {
      setOptionWidth(width);
    }
  };
  return (
    <View style={styles.root}>
      {back && (
        <TouchableWithoutFeedback onPress={onGoBack || goBack}>
          <View
            style={[styles.back, optionWidth && {width: optionWidth}]}
            onLayout={handleOptionLayout}>
            <Image style={styles.backIcon} source={image.back} />
          </View>
        </TouchableWithoutFeedback>
      )}

      <View style={styles.center}>
        <TextWrap
          numberOfLines={1}
          ellipsizeMode="tail"
          font={fonts.barlowBold}
          style={styles.title}>
          {title}
        </TextWrap>
      </View>

      <View
        onLayout={handleOptionLayout}
        style={[optionWidth && {width: optionWidth}]}>
        {options}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    minHeight: 60,
    alignSelf: 'stretch',
    borderBottomColor: '#e5e5e5',
  },
  center: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 22,
    flex: 1,
    marginRight: 16,
    color: '#222222',
  },
  back: {
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
