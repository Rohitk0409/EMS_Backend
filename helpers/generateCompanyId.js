const generateCompanyId = (name) => {
  const cleanName = name.replace(/\s+/g, "");

  const firstTwo = cleanName.slice(0, 2).toUpperCase();
  const lastTwo = cleanName.slice(-2).toUpperCase();

  const randomDigits = Math.floor(1000 + Math.random() * 9000);

  return `${firstTwo}${lastTwo}${randomDigits}`;
};

module.exports = generateCompanyId;
