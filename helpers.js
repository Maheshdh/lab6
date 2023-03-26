// You can add and export any helper functions you want here - if you aren't using any, then you can just leave this file as is
// You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.


/**
 * Checks if the input is a valid string type not undefined or non string
 * @param {*} str  input string param
 * @returns True if its a valid string type
 */
const isValidStringType = (str) =>{
    return (! (typeof str === undefined || typeof str !== 'string' ))
    }


//TODO Test This, Null check too
 const isValidArrayType = (arr) =>{
    return (! (typeof arr === undefined || !(Array.isArray(arr)) ))
    }

//TODO Test This, Null check too, decimal places
const isValidNumberType = (num) =>{
    return (! (typeof num === undefined || !(typeof num === "number") || !(Number.isInteger(num) )))
    }
/**
* Checks if the input is valid string without empty spaces
* @param {*} str input string param
* @returns boolean value if vaild
*/
const isValidStringParameter = (str)  =>{
return (! ( str.trim().length === 0))
}


const varToString = varObj => Object.keys(varObj)[0]
/**
 * Checks if the input parameter is of valid string type and is not consisting of only spaces.
 * Throws error elsewise
 * @param {*} inputParameter the input parameter which is neeed to be checked upon
 */
 const validateStringInput = (inputParameter) => {
    let paramterName = varToString({ inputParameter })

    if(! isValidStringType(inputParameter)){
        throw new Error(paramterName + " should be a valid string input");
    }

    if(! isValidStringParameter(inputParameter)){
        throw new Error(paramterName + " should not consist of just empty spaces");
    }
    return inputParameter.trim();
}

/**
 * Checks if the input parameter is of valid string type and is not consisting of only spaces.
 * Throws error elsewise
 * @param {*} inputParameter the input parameter which is neeed to be checked upon
 */
 const validateNumberInput = (inputParameter) => {
    let paramterName = varToString({ inputParameter })

    if(! isValidNumberType(inputParameter)){
        throw new Error(paramterName + " should be a valid number input");
    }
}


const validateWebsiteString = (websiteStr) => {
    websiteStr = validateStringInput(websiteStr);
    if(! websiteStr.startsWith('http://www.') || !websiteStr.endsWith('.com') || websiteStr.length < 20){
        throw new Error(" Website entered is not in correct format");
    }
    return websiteStr.trim();
}


const validateYear = (year) => {
    year = validateNumberInput(year);
    if( year < 1900 || year > new Date().getFullYear()){
        throw new Error(" Year should be more than 1900 and less than current year");
    }
return year;
}

/**
 * Checks if the input parameter is of valid string type and is not consisting of only spaces.
 * Throws error elsewise
 * @param {*} inputParameter the input parameter which is neeed to be checked upon
 */
 const validateArrayInput = (inputParameter) => {
    let paramterName = varToString({ inputParameter })

    if(! isValidArrayType(inputParameter)){
        throw new Error(paramterName + " should be a valid Array  input");
    }

    if(! inputParameter.length === 0){
        throw new Error(paramterName + " is an empty array, and is not a valid input");
    }
    inputParameter.map(element => {
        return validateStringInput(element);
    });

    return inputParameter;
}

export {validateArrayInput, validateYear, validateWebsiteString,validateNumberInput,validateStringInput}