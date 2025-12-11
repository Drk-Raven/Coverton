export const formatDecimals = (number, formatValue = true) => {
  const significantDigits = 3;

  const exponentMapping = {
    0: '⁰',
    1: '¹',
    2: '²',
    3: '³',
    4: '⁴',
    5: '⁵',
    6: '⁶',
    7: '⁷',
    8: '⁸',
    9: '⁹',
    '-': '⁻',
    '+': '',
  };

  const numberToExponent = num =>
    num
      .split('')
      .map(char => exponentMapping[char])
      .join('');

  if (number === null || isNaN(number)) {
    return '-';
  }

  try {
    if (typeof number !== 'number') {
      number = Number(number);
    }

    const finalResult =
      Math.abs(number) < 1000
        ? Number(number.toPrecision(significantDigits))
        : Math.round(number, 0);

    // Extremely small value → scientific notation
    if (formatValue && Math.abs(finalResult) < 0.000001 && number !== 0) {
      let [base, exponent] = finalResult.toExponential()?.split('e');

      base = Number(base).toLocaleString('en-IN', {
        minimumSignificantDigits: significantDigits,
      });

      return `${base}×10${numberToExponent(exponent)}`;
    }

    return formatValue
      ? finalResult.toLocaleString('en-IN', {
          minimumSignificantDigits: significantDigits,
        })
      : finalResult;
  } catch (error) {
    return '-';
  }
};


export const getCategoriesByProduct = (categories, leadData) => {
  return categories?.filter(cat => cat?.productId === leadData?.product);
};

export const formatDate = date => {
  if (!date) return '';
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
};

export const truncateFileName = (name, maxLength = 25) => {
  if (!name || name.length <= maxLength) return name;
  const extension = name.split('.').pop();
  const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
  const truncated = nameWithoutExt.substring(
    0,
    maxLength - extension.length - 4,
  );
  return `${truncated}...${extension}`;
};

export const isImageFile = document => {
  if (!document || !document.type) return false;
  return document.type.startsWith('image/');
};

export const isPdfFile = document => {
  if (!document) return false;
  const name = document.name?.toLowerCase() || '';
  const type = document.type?.toLowerCase() || '';
  return type.includes('pdf') || name.endsWith('.pdf');
};

export const lowerCase = value => {
  return (value?.split(' ')?.join(''))?.toLowerCase()
}

export const validatePAN = (panNumber) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(panNumber.toUpperCase());
}
export const validateAadhar = (aadhaar) => {
  const regex = /^\d{4}\s?\d{4}\s?\d{4}$/;
  return regex.test(aadhaar);
}