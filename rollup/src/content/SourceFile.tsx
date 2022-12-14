import React, { useEffect } from 'react'
import hljs from 'highlight.js'
import './index.css'
import style from "./index.module.scss"

const SourceFile = (props: any) => {
  const { show, errorInfo } = props
  
  useEffect(() => {
    // 配置 highlight.js
    hljs.configure({
      languages: ['javascript'],
      ignoreUnescapedHTML: true
    })
  }, [])

  useEffect(() => {
    if (show) {
      const codes = document.querySelectorAll('pre .minicode')
      codes.forEach((el) => {
        // 让code进行高亮
        hljs.highlightElement(el as HTMLElement)
      })
    }
  }, [show])

  const scrollLocation = (keyId: number) => {
    const targetEl = document.getElementById(`mini-code${keyId}`)!
    const containerEl = document.getElementById('codeContainer')!
    containerEl.scrollTop = targetEl.offsetTop - 200
  }

  const close = () => {
    props.close()
  }

  return <div >
    {show ? <div className={style.file_box}>
      <div className={style.code_header}>
        <span onClick={() => scrollLocation(errorInfo.line - 1)} className={style.line}>错误行数：{errorInfo.line}</span>
        <span>错误文件名：{errorInfo.source}</span>
        <button onClick={() => close()} className={style.close_button}>关闭</button>
      </div>
      <div id="codeContainer" contentEditable="true" suppressContentEditableWarning className={style.code_content}>
        <pre className={style.code} dangerouslySetInnerHTML={{ __html: errorInfo.sourceContent }} >
        </pre>
      </div>
    </div> : null}
  </div>
}

export default SourceFile