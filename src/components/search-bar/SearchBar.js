import React from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import fonts from '../../libs/fonts';
import image from '../../libs/image';
import TextWrap from '../text-wrap/TextWrap';
export default function SearchBar({
  onPress,
  onBlur,
  number,
  optionComponent,

  autoFocus,
  style,
  placeholder,
  value,
  onChange,
  onSearch,
  inputRef,
  maxLength,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!Boolean(onPress)}
      style={[styles.root, style]}>
      <Image style={styles.icon} source={image.search} />
      {Boolean(onPress) ? (
        <TextWrap
          style={[
            styles.inputText,
            {color: Boolean(value) ? '#222222' : '#ababab'},
          ]}>
          {value || placeholder}
        </TextWrap>
      ) : (
        <TextInput
          autoFocus={autoFocus}
          ref={inputRef}
          style={styles.input}
          placeholderTextColor={'#ababab'}
          placeholder={placeholder}
          onBlur={onBlur}
          value={value}
          autoCapitalize="none"
          keyboardType={number ? 'decimal-pad' : 'default'}
          maxLength={maxLength}
          onChangeText={(t) => {
            if (number && t && isNaN(t)) {
              return;
            }
            onChange(t);
          }}
          returnKeyType="search"
          onSubmitEditing={onSearch}
        />
      )}
      {Boolean(optionComponent) && (
        <TouchableWithoutFeedback
          onPress={(e) => {
            e.stopPropagation();
          }}>
          <View style={styles.option}>{optionComponent}</View>
        </TouchableWithoutFeedback>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option: {
    paddingHorizontal: 12,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  root: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#222222',
    padding: 0,
    paddingVertical: 12,
    fontFamily: fonts.robotoRegular,
  },
  inputText: {
    flex: 1,
    color: '#222222',
    padding: 0,
    paddingVertical: 12,
    fontSize: 14,
    lineHeight: 17,
  },
});
