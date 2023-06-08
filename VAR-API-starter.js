const symbol = args[0]

// Get the current date
const currentDate = new Date()

// Get the day, month, and year from the current date
const day = String(currentDate.getDate()).padStart(2, "0")
const month = String(currentDate.getMonth() + 1).padStart(2, "0")
const year = currentDate.getFullYear()

// Format the date string as dd/mm/yyyy
const formattedDate = `${day}/${month}/${year}`

const varAPIInput = {
  asset: symbol,
  end_date: formattedDate,
  collateralValue: 10000,
  risk_level: 0.05,
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

return Functions.encodeUint256(Math.round(parseFloat(varCalc[0]["Daily VaR Implied Vol USD"])))
