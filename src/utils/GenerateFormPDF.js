function convertPointsToUnit(points, unit) {
  // Unit table from https://github.com/MrRio/jsPDF/blob/ddbfc0f0250ca908f8061a72fa057116b7613e78/jspdf.js#L791
  var multiplier;
  switch(unit) {
    case 'pt':  multiplier = 1;          break;
    case 'mm':  multiplier = 72 / 25.4;  break;
    case 'cm':  multiplier = 72 / 2.54;  break;
    case 'in':  multiplier = 72;         break;
    case 'px':  multiplier = 96 / 72;    break;
    case 'pc':  multiplier = 12;         break;
    case 'em':  multiplier = 12;         break;
    case 'ex':  multiplier = 6;
    default:
				throw ('Invalid unit: ' + unit);
  }
  return points * multiplier;
}

const timestampDisplayOptions = {
  year: "numeric",
  month: "short", 
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  timeZoneName: "long"
}

async function generateFormPDF(fields) {
  const jsPDF = await import(/* webpackChunkName: 'jspdf' */'jspdf');
  var doc = new jsPDF.default({
      orientation: 'portrait',
      unit: 'px',
  })

  const yMargin = 64;
  const xMargin = 32;

  let cursorY = yMargin;

  doc.setFontSize(32);
  doc.text("Case study", xMargin, cursorY);
  doc.setFontSize(12);
  cursorY += 16;
  doc.text("Generated on " + new Date().toLocaleDateString('en-US', timestampDisplayOptions), xMargin, cursorY);

  cursorY += 32;

  const fieldGroupMarginBottom = 10;

  const labelFontSize = 14;
  const labelFontStyle = "bold";
  const labelMarginBottom = 12;

  const fieldValueFontSize = 12;
  const fieldValueFontStyle = "normal";
  
  console.log("Before fields, cursorY -> " + cursorY);
  

  fields.forEach((field, fieldIndex) => {  
    doc.setFontSize(labelFontSize);
    doc.setFontStyle(labelFontStyle);
    doc.text(field.label, xMargin, cursorY);

    cursorY += labelMarginBottom;
    doc.setFontStyle(fieldValueFontSize);

    cursorY = addWrappedText({
      text: field.value,
      textWidth: 450,
      doc,
      fontSize: fieldValueFontSize,
      fontType: fieldValueFontStyle,
      lineSpacing: 10,
      xPosition: xMargin,
      initialYPosition: cursorY
    });

    cursorY += fieldGroupMarginBottom;
  })

  const filenameDateTimeOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    // timeStyle: 'short',
  }

  const dateTimeString = new Date().toLocaleDateString('en-US',filenameDateTimeOptions);

  doc.save('study-' + dateTimeString +'.pdf');
}

function addWrappedText({text, textWidth, doc, fontSize = 10, fontType = 'normal', lineSpacing = 7, xPosition = 10, initialYPosition = 10, pageWrapInitialYPosition = 10}) {
  var textLines = doc.splitTextToSize(text, textWidth); // Split the text into lines
  var pageHeight = convertPointsToUnit(doc.internal.pageSize.getHeight(), "px");   // Get page height, well use this for auto-paging
  
  doc.setFontType(fontType);
  doc.setFontSize(fontSize);
  var cursorY = initialYPosition;

  textLines.forEach(lineText => {
    if (cursorY > pageHeight) { // Auto-paging
      console.log(`cursorY: ${cursorY} > pageHeight ${pageHeight}`);
      doc.addPage();
      cursorY = pageWrapInitialYPosition;
    }
    doc.text(lineText, xPosition, cursorY);
    cursorY += lineSpacing;
  })

  return cursorY;
}

export default generateFormPDF;