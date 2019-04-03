import { ComponentClass } from 'react';
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components';

import { IThreadMeta } from '../../interfaces/thread'

import './threadCard.scss'
import see from './assets/see.png'
import reply from './assets/reply.png'

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {
  threadMeta: IThreadMeta
}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface ThreadCard {
  props: IProps;
}

class ThreadCard extends Component {
  static defaultProps = {
    threadMeta: {
      title: '',
      tid: 1,
      url: '',
      section: '',
      postTime: '',
      author: {
        username: '',
        uid: 1,
        avatar: ''
      },
      stats: {
        viewed: 0,
        replied: 0
      }
    }
  }

  toThread() {
    Taro.getStorage({
      key: 'history'
    }).then((res) => {
      let history = res.data as unknown as Array<IThreadMeta>
      history.push(this.props.threadMeta)
      Taro.setStorage({
        key: 'history',
        data: history
      })
    }, (res) => {
      let history = Array<IThreadMeta>()
      history.push(this.props.threadMeta)
      Taro.setStorage({
        key: 'history',
        data: history
      })
    })
    const { tid } = this.props.threadMeta
    Taro.navigateTo({
      url: `/pages/thread/thread?tid=${tid}`
    })
  }

  render() {
    const { title, section, author, stats } = this.props.threadMeta
    return <View className='item' onClick={this.toThread}>
      <View className='header at-row at-row__justify--between'>
        <View className='author at-col'>
          {author.avatar && <Image src={author.avatar} mode='aspectFill'></Image>}
          <Text>{author.username}</Text>
        </View>
        <Text className='type'>{section}</Text>
      </View>
      <View className='at-row'>
        <Text className='title at-col--wrap'>{title}</Text>
      </View>
      <View className='footer at-row at-row__align--center at-row__justify--end'>
        <View className='stats'>
          <View className='at-row'>
            <Image src={see}></Image>
            <Text>{stats.viewed}</Text>
          </View>
        </View>
        <View className='stats'>
          <View className='at-row'>
            <Image src={reply}></Image>
            <Text>{stats.replied}</Text>
          </View>
        </View>
      </View>
    </View>
  }
}

export default ThreadCard as ComponentClass<PageOwnProps, PageState>
