import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, ScrollView, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ButtonImage from '../../components/button-image/ButtonImage';
import ChatGroup from '../../components/chat-group/ChatGroup';
import ChatSingle from '../../components/chat-single/ChatSingle';
import SearchBar from '../../components/search-bar/SearchBar';
import TabTopBar from '../../components/tab-topbar/TabTopbar';
import Tabs from '../../components/tabs/Tabs';
import consts from '../../libs/consts';
import image from '../../libs/image';
import routes from '../../libs/routes';
import {dialogError} from '../../redux/dialog/DialogActions';
import {navigate, navigationRef} from '../../services/navigation';
import {requestGet} from '../../services/network';
import socketIo from 'socket.io-client';
import {chatActionType} from '../../redux/chat/ChatActions';
import {screenWidth} from '../../services/util';

export default function TabsChat({}) {
  const dispatch = useDispatch();
  const scrollRef = useRef();
  const pagerRef = useRef();
  const scrollGroupRef = useRef();
  const focused = useIsFocused();
  const {userId} = useSelector((s) => s.user, []);
  const [data, setData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  const fetchChats = async () => {
    try {
      const chats = await requestGet({
        url: consts.apiUrl + `/users/${userId}/chats`,
        query: {
          type: 'single',
        },
      });
      setData([...chats]);
    } catch (error) {
      dispatch(dialogError(error));
    }
  };

  const fetchGroupChats = async () => {
    try {
      const chats = await requestGet({
        url: consts.apiUrl + `/users/${userId}/chats`,
        query: {
          type: 'group',
        },
      });
      setGroupData([...chats]);
    } catch (error) {
      dispatch(dialogError(error));
    }
  };

  useEffect(() => {
    scrollGroupRef.current?.scrollToOffset({y: 0, animated: true});
    scrollRef.current?.scrollToOffset({y: 0, animated: true});
  }, [tabIndex]);

  useEffect(() => {
    if (focused) {
      fetchChats();
      fetchGroupChats();
    }
  }, [tabIndex, focused]);
  /** useEffect(() => {

  }, [isFocused]); */
  useEffect(() => {
    //update chat length
    requestGet({
      url: consts.apiUrl + '/users/' + userId + '/chats/unreadlength',
    })
      .then(({length}) => {
        dispatch({type: chatActionType.updateLength, length});
      })
      .catch(console.log);

    let socket;
    let chatListener;
    if (focused) {
      socket = socketIo(consts.apiUrl, {
        query: `userId=${userId}&type=chat`,
        secure: true,
      });
      chatListener = (data) => {
        let needFetch = false;
        setData((chats) => {
          const index = chats.findIndex((x) => x.chatId === data.chatId);
          if (index >= 0) {
            chats[index].lastMessage =
              data.type === 'T' || data.type === 'C'
                ? data.value
                : data.fileName;
            chats[index].lastMessagedAt = data.createdAt;
            chats[index].unReadLength = chats[index].unReadLength + 1;
          } else {
            needFetch = true;
          }
          return [...chats];
        });
        setGroupData((chats) => {
          const index = chats.findIndex((x) => x.chatId === data.chatId);
          if (index >= 0) {
            chats[index].lastMessage =
              data.type === 'T' || data.type === 'C'
                ? data.value
                : data.fileName;
            chats[index].lastMessagedAt = data.createdAt;
            chats[index].unReadLength = chats[index].unReadLength + 1;
          } else {
            needFetch = true;
          }
          return [...chats];
        });
        if (needFetch) {
          fetchChats();
          fetchGroupChats();
        }
      };
      socket.on('chat', chatListener);
      socket.connect();
    }

    return () => {
      if (socket) {
        if (chatListener) {
          socket.off('chat', chatListener);
        }
        socket.disconnect();
        socket.close();
        socket = null;
      }
    };
  }, [focused]);

  const handleChatItemPress = useCallback(
    (item) => () => {
      navigate(routes.message, {
        chatId: item.chatId,
      });
    },
    [],
  );

  if (
    !focused &&
    [routes.tabFriends, routes.tabMore, routes.tabFind].includes(
      navigationRef.current.getCurrentRoute().name,
    )
  ) {
    return null;
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <TabTopBar title="Chats">
        <ButtonImage
          onPress={() => {
          }}
          paddingHorizontal={7}
          size={24}
          source={image.setting}
          style={{marginRight: 9}}
        />
      </TabTopBar>
      <SearchBar
        style={styles.searcHBar}
        placeholder="Search"
        onPress={() => {
        }}
      />
      <Tabs
        hideBall={true}
        style={styles.tabs}
        dataPin={[
          data.reduce((p, c) => p + c.unReadLength, 0) > 0,
          groupData.reduce((p, c) => p + c.unReadLength, 0) > 0,
        ]}
        data={['1 : 1', 'Group']}
        index={tabIndex}
        onIndexChange={(i) => {
          setTabIndex(i);
          pagerRef.current?.scrollTo({animated: true, x: i * screenWidth});
        }}
      />
      <ScrollView
        ref={pagerRef}
        pagingEnabled
        horizontal
        style={{flex: 1}}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const pageIndex = Math.round(
            e.nativeEvent.contentOffset.x /
              e.nativeEvent.layoutMeasurement.width,
          );
          setTabIndex(pageIndex);
        }}>
        <FlatList
          initialNumToRender={5}
          style={styles.falt}
          ref={scrollRef}
          data={data}
          showsVerticalScrollIndicator={false}
          extraData={data}
          keyExtractor={(item, index) =>
            item.chatId +
            '' +
            item.unReadLength +
            item.pin +
            item.notification +
            item.lastMessage
          }
          renderItem={({item, index}) => {
            return (
              <ChatSingle
                {...item}
                onPress={handleChatItemPress(item)}
              />
            );
          }}
        />
        <FlatList
          style={styles.falt}
          ref={scrollGroupRef}
          data={groupData}
          showsVerticalScrollIndicator={false}
          extraData={groupData}
          keyExtractor={(item, index) =>
            item.chatId +
            '' +
            item.unReadLength +
            item.pin +
            item.notification +
            item.lastMessage
          }
          renderItem={({item, index}) => {
            return (
              <ChatGroup
                onLongPress={handleChatItemLongPress(item, true)}
                {...item}
                onPress={handleChatItemPress(item, true)}
              />
            );
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  falt: {
    width: screenWidth,
  },
  searcHBar: {
    marginVertical: 6,
    marginHorizontal: 16,
  },
  tabs: {marginTop: 16},
});
