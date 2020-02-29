const options = {
  encoding: "alphanumeric",
}

async function generateQRCode(cryptoKey) {
  const QRCode = await import(/* webpackChunkName: 'crypto+qr' */'qrcode');
  // process.env.BASE_URL + "?channel_id=" + this.channel_id + "&crypto_key=" + "abcdefg";

  return await QRCode.default.toDataURL(cryptoKey, options);
}

export default generateQRCode;