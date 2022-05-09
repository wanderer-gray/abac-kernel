const iNull = convertToIText('null')

const iFalse = convertToIText('false')

const iTrue = convertToIText('true')

const iNot = convertToIText('not')

const iAnd = convertToIText('and')

const iOr = convertToIText('or')

const iIn = convertToIText('in')

const iLike = convertToIText('like')

const iBetween = convertToIText('between')

const iIs = convertToIText('is')

function convertToIText (text: string) {
  return text.toUpperCase()
}

export {
  iNull,
  iFalse,
  iTrue,
  iNot,
  iAnd,
  iOr,
  iIn,
  iLike,
  iBetween,
  iIs,
  convertToIText
}
