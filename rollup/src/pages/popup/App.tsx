import React, { useEffect } from 'react'
import styles from './index.module.scss'
import Fingerprint2 from 'fingerprintjs2';

let cookieValue = ''
// 获取多个cookie，并设置到当前插件页面下
chrome.cookies.getAll({ domain: 'wedata.weixin.qq.com' }, function (cookie) {
  cookie.forEach(function (c) {
    cookieValue += (c.name + '=' + c.value + ';')
  });
  cookieValue = cookieValue
});

const getSourceMap = async () => {
  let data = await fetch('http://175.178.74.222:3000/getSourceMap', {
    method: 'post',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cookie: cookieValue,
      id: localStorage.getItem('browserId') || ''
    })
  }).then((response) => {
    return response.json()
  })
  console.log('getSourceMap Data', data)
}

const getFingerprint = (callback: Function) => {
  if (localStorage.getItem('browserId')) {
    callback(localStorage.getItem('browserId'))
    return
  }
  Fingerprint2.get((components) => { // 参数只有回调函数时，默认浏览器指纹依据所有配置信息进行生成
    const values = components.map(component => component.value) // 配置的值的数组
    const murmur = Fingerprint2.x64hash128(values.join(''), 31) // 生成浏览器指纹
    localStorage.setItem('browserId', murmur)
    callback(murmur)
  });
}

const App = (): JSX.Element => {
  useEffect(() => {
    getFingerprint((browserId: string) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id!, {
          type: 1,
          message: browserId
        }, function (response) {
          console.log('sendMessage response', response)
        });
      });
    })
  }, [])
  return (
    <div className={styles.page}>
      <h1>微信小程序sourceMap解析</h1>
      <div className={styles.button} onClick={() => getSourceMap()}>获取sourceMap</div>
    </div>
  )
}



export default App
