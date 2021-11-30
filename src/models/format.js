String.prototype.format = function () {
    var txt = this.toString()
    for (var i = 0; i < arguments.length; i++) {
      var exp = getStringFormatPlaceHolderRegEx(i)
      arguments[i] = String(arguments[i]).replace(/\$/gm, '♒☯◈∭')
      txt = txt.replace(exp, arguments[i] == null ? '' : arguments[i])
      txt = txt.replace(/♒☯◈∭/gm, '$')
    }
    return cleanStringFormatResult(txt)
  }
  
  function getStringFormatPlaceHolderRegEx (placeHolderIndex) {
    return new RegExp('({)?\\{' + placeHolderIndex + '\\}(?!})', 'gm')
  }
  function cleanStringFormatResult (txt) {
    if (txt == null) return ''
    return txt.replace(getStringFormatPlaceHolderRegEx('\\d+'), '')
  }
  