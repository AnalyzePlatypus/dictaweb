import Vue from 'vue';

async function installCryptoQR() {
  const jsReader = await import(/* webpackChunkName: 'crypto+qr' */'jsqr');
  const qrGenerator = await import(/* webpackChunkName: 'crypto+qr' */'qrcode');
  const libsodium = await import(/* webpackChunkName: 'crypto+qr' */'libsodium-wrappers');
}

export default installCryptoQR;