import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import styles from './index.module.scss'

/**
 * 通知栏组件
 */
const Notification = React.memo((props: {
  children: JSX.Element | string | never[]
  onClose?: () => void
}) => {

  const { children, onClose } = props

  const container = useRef(document.createElement('div')) // 这里必须使用 useRef，不然每次渲染之后都需要重新创建div，会出现只有第一次渲染出现了内容的bug

  useEffect(() => {
    container.current.classList.add('notify-portal-container')
    document.documentElement.appendChild(container.current)
    return () => {
      document.documentElement.removeChild(container.current)
    }
  }, [props.children])

  return (
    ReactDOM.createPortal(
      <React.Fragment>
        <div className={styles.notify_content}>
          {children}
        </div>
        <div className="notify-portal-close"
          onClick={() => { onClose ? onClose() : void 0 }}
        >
        </div>
      </React.Fragment>,
      container.current
    )
  )
})

export default Notification
