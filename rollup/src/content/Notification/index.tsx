import React, { useState } from "react";
import Notification from './Notification'
/**
 * 封装 hook
 */
export const useNotify = (): {
  /**
   * 展示通知栏
   */
  show: (info: string) => void
  /**
   * 隐藏通知栏
   */
  hide: () => void
  /**
   * 渲染通知栏
   */
  RenderNotification: (props: { children: JSX.Element | string | never[] }) => any
} => {

  const [visible, setVisible] = useState(false)
  const [info, setInfo] = useState('')

  const show = (info: string) => {
    setInfo(info)
    setTimeout(() => {
      setVisible(false)
    }, 2000);
    setVisible(true)
  }
  const hide = () => setVisible(false)
  const RenderNotification = ({ children }: { children: JSX.Element | string | never[] }) => {
    return (
      visible ? <Notification onClose={hide} >
        {children ? children : info}
      </Notification> : null
    )
  }

  return {
    show,
    hide,
    RenderNotification
  }
}
