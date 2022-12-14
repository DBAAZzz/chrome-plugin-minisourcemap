import React, { useEffect } from 'react'
import styles from './index.module.scss'
import { getFingerprint } from '../../utils'

let cookieValue = ''
// 获取多个cookie，并设置到当前插件页面下
chrome.cookies.getAll({ domain: 'wedata.weixin.qq.com' }, function (cookie) {
  cookie.forEach(function (c) {
    cookieValue += (c.name + '=' + c.value + ';')
  });
  cookieValue = cookieValue
});

const getSourceMap = async () => {
  let data = await fetch('http://localhost:3000/getSourceMap', {
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
