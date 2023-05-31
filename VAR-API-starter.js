const symbol = args[0]
const endTime = Date.now() // Current timestamp
const startTime = endTime - 30 * 24 * 60 * 60 * 1000 // 30 days of data

const binanceRequest = Functions.makeHttpRequest({
  url: `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&startTime=${startTime}&endTime=${endTime}`,
})

const [binanceResponse] = await Promise.all([binanceRequest])

var varAPIInput = {}

if (!binanceResponse.error) {
  varAPIInput = {
    collateralValue: 10000,
    risk_level: 0.05,
    prices: binanceResponse.data.map((item) => {
      return {
        rate_close: parseFloat(item[4]),
      }
    }),
  }
} else {
  console.log("BinanceAPI Error")
}

const varAPIRequest = Functions.makeHttpRequest({
  url: `https://var-calculation.herokuapp.com/calculate_var`,
  method: `POST`,
  headers: { "Content-Type": "application/json" },
  timeout: 9000,
  data: varAPIInput,
})

const [varAPIResponse] = await Promise.all([varAPIRequest])

const varCalc = []

if (!varAPIResponse.error) {
  varCalc.push(varAPIResponse.data)
} else {
  console.log("VarAPI Error", varAPIResponse.message, varAPIResponse.code)
}

console.log("varRaw:", varCalc)
console.log("varCalcProcessed:", parseFloat(varCalc[0].substring(17, 34)))

return Functions.encodeUint256(Math.round(parseFloat(varCalc[0].substring(17, 34))))
