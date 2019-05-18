import { ComponentClass } from 'react'
import { connect } from '@tarojs/redux'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtList, AtListItem, AtAvatar } from 'taro-ui'

import { IAccount } from '../../interfaces/account'
import { initCredential } from '../../actions/account'
import empty_avatar_user from './assets/empty_avatar_user.png'

import './account.scss'

type PageStateProps = {
  auth: boolean,
  account: IAccount,
}

type PageDispatchProps = {
  initCredential: () => void
}

type PageOwnProps = {}

type PageState = {
  history: number,
  logoutConfirmModal: boolean
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Account {
  props: IProps;
}

@connect(({ account }) => ({
  auth: account.auth,
  account: account.account
}), (dispatch) => ({
  initCredential() {
    dispatch(initCredential())
  }
}))
class Account extends Component {
  config: Config = {
    navigationBarTitleText: '我的'
  }

  state = {
    history: 0,
    logoutConfirmModal: false
  }

  componentDidShow() {
    Taro.getStorage({
      key: 'history'
    }).then((res) => {
      this.setState({
        history: res.data.length
      })
    }, () => {
      this.setState({
        history: 0
      })
    })

    this.props.initCredential()
  }

  navigator(addr: string) {
    Taro.navigateTo({
      url: `/pages/account/${addr}`
    })
  }

  handleProfile() {
    if (this.props.auth) {
      // this.navigator('profile')
    } else {
      this.navigator('login')
    }
  }

  joking() {
    Taro.showToast({
      title: '这里还没抛瓦 QAQ',
      icon: 'none',
      duration: 1500
    })
  }

  render() {
    const { auth, account } = this.props
    return (
      <View className='wrapper'>
        <View className='profile' onClick={this.handleProfile}>
          <View className='info'>
            <AtAvatar
              className='avatar'
              circle
              image={auth ? account.avatar : empty_avatar_user}
              size='normal'
            ></AtAvatar>
            <View className='text'>
              <View className='name'>{auth ? account.username : '登录'}</View>
              {auth
                ? <View>充满抛瓦！(๑•̀ㅂ•́)و✧</View>
                : <View>一直未登录你怎么变强？w(ﾟДﾟ)w</View>}
            </View>
          </View>

          <View className='more at-icon at-icon-chevron-right'></View>
        </View>

        <View className='forum-area'>
          <AtList>
            <AtListItem
              title='消息中心'
              iconInfo={{ value: 'bell', color: '#ABB4BF' }}
              onClick={this.joking}
            />
            <AtListItem
              title='我的收藏'
              extraText='0 个'
              iconInfo={{ value: 'star', color: '#ABB4BF' }}
              onClick={this.joking}
            />
            <AtListItem
              title='浏览历史'
              extraText={`${this.state.history} 篇`}
              iconInfo={{ value: 'clock', color: '#ABB4BF' }}
              onClick={this.navigator.bind(this, 'history')}
            />
          </AtList>
        </View>

        <View className='program-area'>
          <AtList>
            <AtListItem
              title='设置'
              iconInfo={{ value: 'settings', color: '#ABB4BF' }}
              onClick={this.navigator.bind(this, 'setting')}
            />
            <AtListItem
              title='关于'
              iconInfo={{ value: 'lightning-bolt', color: '#ABB4BF' }}
              onClick={this.navigator.bind(this, 'about')}
            />
          </AtList>
        </View>
      </View>
    )
  }
}

export default Account as ComponentClass<PageOwnProps, PageState>
