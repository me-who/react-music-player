import React from 'react'
import './progress.less'

class Progress extends React.Component{
  constructor(props){
    super(props);
    /*解释一下上面为什么要用bind传this，因为这个函数是在浏览器全局对象执行的，此时this不指向react组件部分
		React.createClass这种方式中事件是默认绑定到当前类中，但是使用es6语法的话，需要手动绑定。*/
    this.changeProgress = this.changeProgress.bind(this);
  }
  changeProgress(event) {
    let progressBar = this.refs.progressBar;
    let progress = (event.clientX - progressBar.getBoundingClientRect().left) / progressBar.clientWidth;
    this.props.onProgressChange && this.props.onProgressChange(progress);
  }
  render() {
    return (
      <div className="components-progress" ref="progressBar" onClick={this.changeProgress}>
        <div className="progress" style={{width:`${this.props.progress}%`}}></div>
      </div>
    );
  }
}
export default Progress;
