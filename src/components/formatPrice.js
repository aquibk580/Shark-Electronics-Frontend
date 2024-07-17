const formatPrice = (price) => {
  let priceStr = price.toString();

  if (priceStr.length === 4) {
    return `${priceStr[0]},${priceStr.slice(1)}`;
  } else if (priceStr.length === 5) {
    return `${priceStr.slice(0, 2)},${priceStr.slice(2)}`;
  } else if (priceStr.length === 6) {
    return `${priceStr[0]},${priceStr.slice(1, 3)},${priceStr.slice(3)}`;
  } else {
    return priceStr;
  }
};

export default formatPrice;
