import BigNumber from 'bignumber.js'
BigNumber.config({ EXPONENTIAL_AT: 100 })
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
    if (/^[0-9]+$/.test(char) && value.split('').length < 10) return true
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

  const currencyFormat = (
    amount?: number | string | null,
    minimumDigits = 2
  ) => {
    try {
      if (!amount) {
        return '0'
      }

      if (typeof amount !== 'number') {
        amount = +amount
      }

      let tmp_amount = amount.toString().replace(/,/g, '')
      let temp = new BigNumber(tmp_amount).toString()
      let t = ','
      let p = '.'
      let x = temp.split('.')
      let x1 = x[0]
      let x2 = ''
      if (minimumDigits === null) {
        if (x.length > 1) {
          minimumDigits = x[1].length
        } else {
          minimumDigits = 0
        }
      }
      if (minimumDigits > 0) {
        if (x.length > 1) {
          x[1] = (x[1] + '000').substring(0, minimumDigits)
          x2 = p + x[1]
        }
      }
      let rgx = /(\d+)(\d{3})/
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + t + '$2')
      }
      return x1 + x2
    } catch (err) {
      return amount
    }
  }

  return {
    currencyFormat,
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
