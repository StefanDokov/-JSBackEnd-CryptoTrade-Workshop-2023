const {payMethodsMap} = require('../config/consts');

exports.getPayMethodata = (selectedMethod) => {
    const payMethods = Object.keys(payMethodsMap).map(key => ({
            value: key, 
            label: payMethodsMap[key], 
            isSelected: selectedMethod == key,
        }));
        return payMethods
}