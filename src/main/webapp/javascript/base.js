let KEYS = {
    customerIdentifier: 'customer_id'
};

function setCustomerIdentifier(identifier) {
    saveValueToSession(KEYS.customerIdentifier, identifier.toString());
}

function getCustomerIdentifier() {
    return parseInt(getValueFromSession(KEYS.customerIdentifier));
}

function saveValueToSession(key, value) {
    sessionStorage.setItem(key, value);
}

function getValueFromSession(key) {
    return sessionStorage.getItem(key);
}

function isCustomerLoggedIn() {
    return typeof getCustomerIdentifier() === 'number';
}


function logout() {
    setCustomerIdentifier(-1);
}
