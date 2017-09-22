import React from 'react'
import Header from './components/header'
import Player from './page/player'
import MusicList from './page/musiclist'
import { MUSIC_LIST } from './config/musiclist'
import { Router, IndexRoute, Link, Route, hashHistory } from 'react-router'
import Pubsub from 'pubsub-js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      musicList: MUSIC_LIST,
      currentMusicItem: MUSIC_LIST[0],
      isPlay: null
    };
  }

  playMusic(musicItem) {
    $('#player').jPlayer('setMedia', {
      mp3: musicItem.file
    }).jPlayer('play');
    this.setState({
      currentMusicItem: musicItem
    });
  }

  playNext(type = 'next') {
    let index = this.findMusicIndex(this.state.currentMusicItem);
    let newIndex = null;
    let musicListLength = this.state.musicList.length;
    if (type === 'next') {
      // 将下一首的歌曲index对歌曲列表进行取余，避免嵌套条件判断或防止数组溢出
      newIndex = (index + 1) % musicListLength;
    }else {
      newIndex = (index - 1 + musicListLength) % musicListLength;
    }
    this.playMusic(this.state.musicList[newIndex]);
  }

  // 将可能重复用到的部分提取出来，即使是很简单的功能
  findMusicIndex(musicItem) {
    return this.state.musicList.indexOf(musicItem);
  }

  componentDidMount() {
    $('#player').jPlayer({
      supplied: 'mp3',
      wmode: 'window'
    });
    this.playMusic(this.state.currentMusicItem);
    // 当前音乐播放完毕后自动播放下一首
    $('#player').bind($.jPlayer.event.ended, (e) => {
      this.playNext();
    });
    Pubsub.subscribe('DELETE_MUSIC', (msg, musicItem) => {
      if (this.state.currentMusicItem === musicItem) {
        this.playNext();
      }
      this.setState({
        musicList: this.state.musicList.filter(item => {
          return item !== musicItem;
        })
      });
    });
    Pubsub.subscribe('PLAY_MUSIC', (msg, musicItem) => {
      this.playMusic(musicItem);
    });
    Pubsub.subscribe('IS_PLAY', (msg, isPlay) => {
      this.setState({
        isPlay: true
      });
    });
    Pubsub.subscribe('PLAY_PREV', (msg) => {
      this.playNext('prev');
    });
    Pubsub.subscribe('PLAY_NEXT', (msg) => {
      this.playNext();
    });
  }

  componentWillUnMount() {
    Pubsub.unsubscribe('DELETE_MUSIC');
    Pubsub.unsubscribe('PLAY_MUSIC');
    Pubsub.unsubscribe('IS_PLAY');
    Pubsub.unsubscribe('PLAY_PREV');
    Pubsub.unsubscribe('PLAY_NEXT');
    $('#player').unbind($.jPlayer.event.ended);
  }

  render() {
    return (
      <div>
        <Header />
        {React.cloneElement(this.props.children, this.state)}
      </div>
    );
  }
}

class Root extends React.Component{
  constructor(props){
    super(props);
  }
  render() {
    return  (
      <Router history={hashHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Player}></IndexRoute>
          <Route path="/list" component={MusicList}></Route>
        </Route>
      </Router>
    )
  }
}
export default Root;
