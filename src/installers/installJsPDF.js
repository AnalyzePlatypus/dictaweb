async function installJsPDF() {
  await import(/* webpackChunkName: 'jspdf' */'jspdf');
}

export default installJsPDF;