

export async function initLibsodium() {
  const sodium = await import(/* webpackChunkName: 'crypto+qr' */'libsodium-wrappers');
  await sodium.default.ready;
  console.log(sodium.default);
  
  return sodium.default;
}
