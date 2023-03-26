import {ObjectId} from 'mongodb';

const varToString = varObj => Object.keys(varObj)[0];

const exportedMethods = {
  checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== 'string') throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
  },

  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  },

  checkStringArray(arr, varName) {
    //We will allow an empty array for this,
    //if it's not empty, we will make sure all tags are strings
    if (!arr || !Array.isArray(arr))
      throw `You must provide an array of ${varName}`;
    for (let i in arr) {
      if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
        throw `One or more elements in ${varName} array is not a string or is an empty string`;
      }
      arr[i] = arr[i].trim();
    }

    return arr;
  },
  validateStringInput (inputParameter) {
    let paramterName = varToString({ inputParameter })

    if(! isValidStringType(inputParameter)){
        throw new Error(paramterName + " should be a valid string input");
    }

    if(! isValidStringParameter(inputParameter)){
        throw new Error(paramterName + " should not consist of just empty spaces");
    }
    return inputParameter.trim();
},
isValidNumberType (num) {
    return (! (typeof num === undefined || !(typeof num === "number") || !(Number.isInteger(num) )))
    },
 validateWebsiteString (websiteStr)  {
    websiteStr = this.checkString(websiteStr);
    if(! websiteStr.startsWith('http://www.') || !websiteStr.endsWith('.com') || websiteStr.length < 20){
        throw new Error(" Website entered is not in correct format");
    }
    return websiteStr.trim();
},

validateNumberInput (inputParameter){
    let paramterName = varToString({ inputParameter })

    if(! this.isValidNumberType(inputParameter)){
        throw new Error(paramterName + " should be a valid number input");
    }
},
 validateYear(year) {
    year = this.validateNumberInput(year);
    if( year < 1900 || year > new Date().getFullYear()){
        throw new Error(" Year should be more than 1900 and less than current year");
    }
return year;
}
};

export default exportedMethods;
