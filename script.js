// CONSTANTS
const EXCHAGE_RATE_API_PATH = "https://api.exchangeratesapi.io/latest?base=INR"
const PRE_SELECTED_FROM         = "INR";
const PRE_SELECTED_TO           = "JPY";
const BASE_CURRENCY             = "INR";

// VARIABLES
var currencyList            
var exchageRateMap          = {}
var baseRate;
var fromCurrencySelect;
var toCurrencySelect;
var fromCurrencyTA;
var toCurrencyTA;
var swapButton;
var exchangeRateMessage;

// init INITIALIZES CODE
function init(){
    initDomRefference()
    initEventListeners()

    setInitDomValues();
}


var initDomRefference = ()=>{
    fromCurrencySelect          = document.getElementById("fromCurrencySelect");
    toCurrencySelect            = document.getElementById("toCurrencySelect");
    fromCurrencyTA              = document.getElementById("fromCurrencyTA");
    toCurrencyTA                = document.getElementById("toCurrencyTA");
    swapButton                  = document.getElementById("swapButton");
    exchangeRateMessage         = document.getElementById("exchangeRateMessage");
}

var initEventListeners = ()=>{
    fromCurrencySelect.addEventListener('change',updateConversionDisplay);
    toCurrencySelect.addEventListener('change',updateConversionDisplay);
    fromCurrencyTA.addEventListener('change',updateConversionDisplay);
    toCurrencyTA.addEventListener('change',updateConversionDisplay);
    swapButton.addEventListener('click',swapCurrencyExchange);
}

var setInitDomValues = ()=>{
    
    fetchExchangeRate(
        (resp)=>{
            base = resp.base;
            exchageRateMap = resp.rates;
            currencyList = Object.keys(exchageRateMap).reduce((a,b)=>{a.push(b); return a;},[])
            fromCurrencySelect.innerHTML = Object.entries(exchageRateMap).map(a=> `<option ${a[0]==PRE_SELECTED_FROM?"selected":""} value="${a[0]}">${a[0]}</option>`).reduce((a,b)=>a+b);
            toCurrencySelect.innerHTML = Object.entries(exchageRateMap).map(a=> `<option ${a[0]==PRE_SELECTED_TO?"selected":""} value="${a[0]}">${a[0]}</option>`).reduce((a,b)=>a+b);
            updateConversionDisplay();
        }
    )
}
var fetchExchangeRate = (func)=>{
    fetch(EXCHAGE_RATE_API_PATH)
    .then(r=> r.json())
    .then(t=> func(t))
}

var updateConversionDisplay= ()=>{
    let fromValue           = fromCurrencyTA.value=='0'||fromCurrencyTA.value==''?1:fromCurrencyTA.value;
    let fromCurr            = fromCurrencySelect.value;    
    let toCurr              = toCurrencySelect.value;

    let ratio               = exchageRateMap[toCurr]/exchageRateMap[fromCurr];
    let value               = fromValue * ratio;
    fromCurrencyTA.value    = fromValue;
    toCurrencyTA.value      = value;
    
    updateExchangeRateMessage()
}
var swapCurrencyExchange = ()=>{
    let temp                            = fromCurrencySelect.value;
    fromCurrencySelect.selectedIndex    = currencyList.indexOf(toCurrencySelect.value);
    toCurrencySelect.selectedIndex      = currencyList.indexOf(temp);

    temp                    = fromCurrencyTA.value;
    fromCurrencyTA.value    = toCurrencyTA.value;
    toCurrencyTA.value      = temp;
    
    updateExchangeRateMessage()
}

var updateExchangeRateMessage = ()=>{
    let fromCurr            = fromCurrencySelect.value;    
    let toCurr              = toCurrencySelect.value;
    let ratio               = exchageRateMap[toCurr]/exchageRateMap[fromCurr];

    exchangeRateMessage.innerHTML = `1 ${fromCurrencySelect.value} equals ${ratio} ${toCurrencySelect.value}`
}
setTimeout(init,1)