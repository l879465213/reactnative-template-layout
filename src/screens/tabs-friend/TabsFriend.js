import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ButtonImage from '../../components/button-image/ButtonImage';
import SearchBar from '../../components/search-bar/SearchBar';
import TabTopBar from '../../components/tab-topbar/TabTopbar';
import TextWrap from '../../components/text-wrap/TextWrap';
import RootLayout from '../../layouts/root-layout/RootLayout';
import colors from '../../libs/colors';
import consts from '../../libs/consts';
import fonts from '../../libs/fonts';
import image from '../../libs/image';
import routes from '../../libs/routes';
import {dialogError, dialogOpenMessage} from '../../redux/dialog/DialogActions';
import {navigate, navigationRef} from '../../services/navigation';
import {requestGet} from '../../services/network';
import {chatActionType} from '../../redux/chat/ChatActions';
export default function TabsFriend({}) {
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const user = useSelector((s) => s.user, []);
  const {params} = useRoute();
  const listRef = useRef();
  const data = useRef([
    {
      ref: createRef(),
      py: 0,
      height: 0,
      y: 0,
      label: 'Friend Requests',
      type: 'request',
    },
    {
      ref: createRef(),
      py: 0,
      height: 0,
      y: 0,
      label: 'Favorites',
      type: 'favorites',
    },
    {
      ref: createRef(),
      py: 0,
      height: 0,
      y: 0,
      label: 'Friends',
      type: 'friends',
    },
  ]).current;
  const [requestTop, setRequestTop] = useState(0);
  const [favoriteTop, setFavotireTop] = useState(0);
  const [friendsTop, setFriendsTop] = useState(0);
  const [currentType, setCurrentType] = useState('');
  const [requestsHeight, setRequestsHeight] = useState(0);
  const [favoritesHeight, setFavoritesHeight] = useState(0);
  const [listMarginRight, setListMarginRight] = useState(0);
  const [scrolling, setScrolling] = useState(false);
  const [currentAlpha, setCurrentAlpha] = useState('A');

  useEffect(() => {
    //init chat length
    requestGet({
      url: consts.apiUrl + '/users/' + user.userId + '/chats/unreadlength',
    })
      .then(({length}) => {
        dispatch({type: chatActionType.updateLength, length});
      })
      .catch(console.log);

    requestGet({
      url: consts.apiUrl + '/users/' + user.userId + '/friends-state',
    })
      .then((data) => {
        if (!data.state) {
          dispatch(
            dialogOpenMessage({
              message: 'Please add a friend from the find menu.',
            }),
          );
        }
      })
      .catch((e) => {
        dispatch(dialogError(e));
      });

  }, []);

  useEffect(() => {
    const toF = requestsHeight + requestTop;
    if (toF !== favoriteTop) {
      setFavotireTop(toF);
    }
    const toFr = toF + favoritesHeight;
    if (toFr !== friendsTop) {
      setFriendsTop(toFr);
    }
  }, [requestsHeight, favoritesHeight, requestTop]);

  const handleScroll = useCallback(
    (e) => {
      let y = e.nativeEvent.contentOffset.y;
      if (y > 0 && !scrolling) {
        setScrolling(true);
        let tm = setTimeout(() => {
          clearTimeout(tm);
          setScrolling(false);
        }, 4000);
      }
      if (y >= friendsTop) {
        setCurrentType('friends');
        const ca = data[2].ref.current?.getCurrentAlpha(y - friendsTop);
        if (ca) {
          setCurrentAlpha(ca);
        }
      } else if (y >= favoriteTop && y < friendsTop) {
        setCurrentType('favorites');
        setCurrentAlpha('A');
      } else if (y >= requestTop && y < favoriteTop && y < friendsTop) {
        setCurrentType('request');
        setCurrentAlpha('A');
      } else {
        setCurrentType('');
        setCurrentAlpha('A');
      }
    },
    [
      requestsHeight,
      favoritesHeight,
      friendsTop,
      scrolling,
      favoriteTop,
      requestTop,
    ],
  );

  const handleListHeaderLayout = useCallback((e) => {
    setRequestTop(e.nativeEvent.layout.height);
  }, []);

  const handleNestedOnHeight = useCallback(
    (type) => (height) => {
      switch (type) {
        case 'request':
          setRequestsHeight(height);
          break;
        case 'favorites':
          setFavoritesHeight(height);
          break;
      }
    },
    [],
  );

  const handleScrollBarLayout = useCallback((e) => {
    setListMarginRight(e.nativeEvent.layout.width + 4 - 16);
  }, []);

  if (
    !focused &&
    [routes.tabChat, routes.tabMore, routes.tabFind].includes(
      navigationRef.current.getCurrentRoute().name,
    )
  ) {
    return null;
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <TabTopBar title="Friends">
        <ButtonImage
          source={image.tabFindOff}
          paddingHorizontal={8}
          tintColor={colors.primary}
          onPress={() => {

          }}
          size={24}
        />
        <ButtonImage
          style={styles.setting}
          source={image.setting}
          paddingHorizontal={8}
          size={24}
          onPress={() => {

          }}
        />
      </TabTopBar>

      <View style={styles.listContainer}>
        <FlatList
          ref={listRef}
          style={[{marginRight: listMarginRight}]}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          ListHeaderComponent={
            <View onLayout={handleListHeaderLayout}>
              <SearchBar
                placeholder="Search"
                style={styles.searchBar}
                value={params?.keyword}
                onPress={() => {

                }}
              />
              <View style={styles.me}>
                
              </View>
            </View>
          }
          data={data}
          extraData={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            
          }}
        />
        {Boolean(currentType) && currentType !== 'request' && (
          <View style={[styles.scrollHint, {right: listMarginRight + 18}]}>
            {currentType === 'favorites' && (
              <Image
                source={image.favoriteOn}
                tintColor={colors.white}
                style={styles.hintFavorite}
              />
            )}
            {currentType === 'friends' && (
              <TextWrap
                style={{color: '#fff', fontSize: 14, lineHeight: 17}}
                font={fonts.barlowBold}>
                {currentAlpha}
              </TextWrap>
            )}
          </View>
        )}
        {scrolling && (
          <View style={styles.bar} onLayout={handleScrollBarLayout}>
            <Image
              source={image.favoriteOn}
              tintColor="#777777"
              style={styles.off}
            />
            {[
              'A',
              'B',
              'C',
              'D',
              'E',
              'F',
              'G',
              'H',
              'I',
              'J',
              'K',
              'L',
              'M',
              'N',
              'O',
              'P',
              'Q',
              'R',
              'S',
              'T',
              'U',
              'V',
              'W',
              'X',
              'Y',
              'Z',
            ].map((t, i) => {
              return (
                <TouchableOpacity
                  style={styles.alpaWrap}
                  key={t}
                  onPress={() => {
                    if (data[2].ref.current) {
                      const y = data[2].ref.current.getScrollY(t);
                      if (listRef.current && y !== undefined) {
                        listRef.current.scrollToOffset({
                          offset: y,
                          animated: true,
                        });
                        setCurrentAlpha(t);
                      }
                    }
                  }}>
                  <TextWrap style={styles.alpa}>{t}</TextWrap>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollHint: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 100,
    position: 'absolute',
    top: 0,
  },
  hintFavorite: {
    width: 17,
    height: 17,
    resizeMode: 'contain',
  },
  setting: {marginRight: 8},
  searchBar: {
    marginHorizontal: 16,
    marginTop: 6,
  },
  me: {
    marginVertical: 10,
  },
  me2: {
    paddingHorizontal: 16,
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  //
  bar: {
    paddingHorizontal: 3,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
  },
  off: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
  },
  alpa: {
    textAlign: 'center',
    alignSelf: 'center',
    lineHeight: 22,
    fontSize: 10,
    color: '#777777',
  },
  alpaWrap: {
    paddingHorizontal: 4,
  },
});
