export default function () {
  const downloadFile = (content: string, fileName: string) => {
    if (isEmpty(content)) return
    var a = document.createElement('a')
    a.href = content
    a.download = fileName
    a.click()
  }
  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  const isEmpty = (value: any) => {
    return (
      value == null ||
      (typeof value === 'object' && Object.keys(value).length === 0) ||
      (typeof value === 'string' && value.trim().length === 0)
    )
  }
  const cloneData = (data: any) => {
    return JSON.parse(JSON.stringify(data))
  }
  const groupBy = (array: any[], key: string) => {
    return array.reduce((objectsByKeyValue: any, obj) => {
      const value = obj[key]
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj)
      return objectsByKeyValue
    }, {})
  }
  const copyToClipboard = (val: string) => {
    const selBox = document.createElement('textarea')
    selBox.style.position = 'fixed'
    selBox.style.left = '0'
    selBox.style.top = '0'
    selBox.style.opacity = '0'
    selBox.value = val
    document.body.appendChild(selBox)
    selBox.focus()
    selBox.select()
    document.execCommand('copy')
    document.body.removeChild(selBox)
  }

  const verifyNumber = (event: {
    keyCode?: number
    which: number
    preventDefault: () => void
  }) => {
    let keyCode = event.keyCode ? event.keyCode : event.which
    let char = String.fromCharCode(keyCode)
    if (/^[0-9.]+$/.test(char)) return true
    else event.preventDefault()
  }

  const verifyNumberList = (event: {
    keyCode?: number
    which: number
    preventDefault: () => void
  }) => {
    let keyCode = event.keyCode ? event.keyCode : event.which
    let char = String.fromCharCode(keyCode)
    if (/^[0-9.,]+$/.test(char)) return true
    else event.preventDefault()
  }

  const verifyDigit = (event: {
    target: HTMLInputElement
    keyCode?: number
    which: number
    preventDefault: () => void
  }) => {
    let value = (event.target as HTMLInputElement).value
    let keyCode = event.keyCode ? event.keyCode : event.which
    let char = String.fromCharCode(keyCode)
    if (/^[0-9]+$/.test(char) && value.split('').length < 13) return true
    else event.preventDefault()
  }

  const limitPercentDecimal = (event: KeyboardEvent, decimal: number = 2) => {
    let value = (event.target as HTMLInputElement).value
    const charCode = event.which ? event.which : event.keyCode
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault()
    }
    //check only one dot
    if (value.split('.').length > 1 && charCode == 46) {
      event.preventDefault()
    }
    //get the cursor position
    const cursorPosition =
      (event.target as HTMLInputElement).selectionStart || 0
    const dotPosition = value.indexOf('.')

    // check limit decimal
    if (
      cursorPosition > dotPosition &&
      dotPosition > -1 &&
      value.split('.')[1].length >= decimal
    ) {
      event.preventDefault()
    }
  }

  const validateNoThaiChar = (event: {
    keyCode?: number
    which: number
    preventDefault: () => void
  }) => {
    let keyCode = event.keyCode ? event.keyCode : event.which
    if (keyCode >= 3585 && keyCode <= 3675) {
      event.preventDefault()
    }
  }

  return {
    downloadFile,
    sleep,
    isEmpty,
    cloneData,
    groupBy,
    copyToClipboard,
    verifyNumber,
    verifyNumberList,
    verifyDigit,
    limitPercentDecimal,
    validateNoThaiChar,
  }
}
