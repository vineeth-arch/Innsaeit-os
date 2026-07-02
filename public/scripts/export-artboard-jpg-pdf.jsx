/*
 * Innsaeit OS — Export active artboard as JPG + PDF
 * Adobe Illustrator ExtendScript (.jsx)
 *
 * What it does: for the frontmost document, exports the ACTIVE artboard as a
 * high-quality JPG and a PDF into a folder you pick, named "{document}-{artboard}".
 *
 * How to run: Illustrator → File ▸ Scripts ▸ Other Script… → pick this file.
 *
 * NOTE: written best-effort and NOT tested inside Illustrator by the author.
 * Verify on a copy of your file first.
 */
#target illustrator

(function () {
  if (app.documents.length === 0) {
    alert('Open a document first.');
    return;
  }

  var doc = app.activeDocument;
  var folder = Folder.selectDialog('Choose an export folder');
  if (!folder) {
    return;
  }

  var abIndex = doc.artboards.getActiveArtboardIndex();
  var abName = doc.artboards[abIndex].name;
  var docName = doc.name.replace(/\.[^\.]+$/, '');
  var base = docName + '-' + abName;

  // Restrict export to the active artboard only.
  doc.artboards.setActiveArtboardIndex(abIndex);

  // --- JPG ---
  var jpgFile = new File(folder.fsName + '/' + base + '.jpg');
  var jpgOpts = new ExportOptionsJPEG();
  jpgOpts.qualitySetting = 100;
  jpgOpts.artBoardClipping = true;
  jpgOpts.horizontalScale = 200; // 2x for crisp raster
  jpgOpts.verticalScale = 200;
  doc.exportFile(jpgFile, ExportType.JPEG, jpgOpts);

  // --- PDF (active artboard only) ---
  var pdfFile = new File(folder.fsName + '/' + base + '.pdf');
  var pdfOpts = new PDFSaveOptions();
  pdfOpts.pDFPreset = '[High Quality Print]';
  pdfOpts.artboardRange = String(abIndex + 1); // 1-indexed range
  doc.saveAs(pdfFile, pdfOpts);

  alert('Exported:\n' + base + '.jpg\n' + base + '.pdf\n\nto ' + folder.fsName);
})();
