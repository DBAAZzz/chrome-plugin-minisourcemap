import React from 'react'
import './index.css'
import style from "./index.module.scss"

const Widget = (props: any) => {

  const click = () => {
    props.click()
  }

  return <div >
    <div className={style.button} onClick={() => { click() }} >
      <span>解析错误</span>
    </div>
  </div>
}

export default Widget