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

/**
 * init INITIALIZES CODE
 */
function init(){
    initDomRefference()
    initEventListeners()

    setInitDomValues();
}

/**
 * initDomRefference INITIALIZED DOM REFFERENCES
 */
var initDomRefference = ()=>{
    fromCurrencySelect          = document.getElementById("fromCurrencySelect");
    toCurrencySelect            = document.getElementById("toCurrencySelect");
    fromCurrencyTA              = document.getElementById("fromCurrencyTA");
    toCurrencyTA                = document.getElementById("toCurrencyTA");
    swapButton                  = document.getElementById("swapButton");
    exchangeRateMessage         = document.getElementById("exchangeRateMessage");
}

/**
 * initEventListeners INITIALIZES ALL EVENT LISTENERS
 */
var initEventListeners = ()=>{
    fromCurrencySelect.addEventListener('change',updateConversionDisplay);
    toCurrencySelect.addEventListener('change',updateConversionDisplay);
    fromCurrencyTA.addEventListener('change',updateConversionDisplay);
    toCurrencyTA.addEventListener('change',updateConversionDisplay);
    swapButton.addEventListener('click',swapCurrencyExchange);
}

/**
 * setInitDomValues WAITS FOR @fetchExchangeRate, UPDATES currencyList, SETS SELECT VALUES AND CONVERSION VALUES 
 */
var setInitDomValues = ()=>{
    fetchExchangeRate(
        (resp)=>{
            base                            = resp.base;
            exchageRateMap                  = resp.rates;
            currencyList                    = Object.keys(exchageRateMap).reduce((a,b)=>{a.push(b); return a;},[])
            fromCurrencySelect.innerHTML    = Object.entries(exchageRateMap).map(a=> `<option ${a[0]==PRE_SELECTED_FROM?"selected":""} value="${a[0]}">${a[0]}</option>`).reduce((a,b)=>a+b);
            toCurrencySelect.innerHTML      = Object.entries(exchageRateMap).map(a=> `<option ${a[0]==PRE_SELECTED_TO?"selected":""} value="${a[0]}">${a[0]}</option>`).reduce((a,b)=>a+b);
            updateConversionDisplay();
        }
    )
}

/**
 * fetchExchangeRate FETCHES EXCHANGE RATE AND CALLS PARAM FUNC
 * 
 * @param  {} func AFTER FUNTION WHICH WILL BE CALLED ONCE THE API PROMISE IS RESOLVED
 */
var fetchExchangeRate = (func)=>{
    fetch(EXCHAGE_RATE_API_PATH)
    .then(r=> r.json())
    .then(t=> func(t))
}
/**
 * updateConversionDisplay UPDATES CURRENCY VALUE BASED ON SELECTED CURRENCIES AND FROM CURRENCY VALUE
 * 
 */
var updateConversionDisplay= ()=>{
    let fromValue           = fromCurrencyTA.value=='0'||fromCurrencyTA.value==''?1:fromCurrencyTA.value;
    let fromCurr            = fromCurrencySelect.value;    
    let toCurr              = toCurrencySelect.value;

    let ratio               = exchageRateMap[toCurr]/exchageRateMap[fromCurr];
    let value               = (fromValue * ratio).toFixed(3);
    fromCurrencyTA.value    = fromValue;
    toCurrencyTA.value      = value;

    updateExchangeRateMessage()
}
/**
 * swapCurrencyExchange SWAPS TO AND FROM CURRENCY AND CORRESPONDING VALUES
 * 
 */
var swapCurrencyExchange = ()=>{
    let temp                            = fromCurrencySelect.value;
    fromCurrencySelect.selectedIndex    = currencyList.indexOf(toCurrencySelect.value);
    toCurrencySelect.selectedIndex      = currencyList.indexOf(temp);

    temp                                = fromCurrencyTA.value;
    fromCurrencyTA.value                = toCurrencyTA.value;
    toCurrencyTA.value                  = temp;
    
    updateExchangeRateMessage()
}
/**
 * updateExchangeRateMessage UPDATES THE EXCHANGE RATE MESSAGE
 */
var updateExchangeRateMessage = ()=>{
    let fromCurr                    = fromCurrencySelect.value;    
    let toCurr                      = toCurrencySelect.value;
    let ratio                       = (exchageRateMap[toCurr]/exchageRateMap[fromCurr]).toFixed(3);

    exchangeRateMessage.innerHTML   = `1 ${fromCurrencySelect.value} equals ${ratio} ${toCurrencySelect.value}`
}
setTimeout(init,1)