import {useState, useEffect} from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type DialogProps = {
    documentURL: string
}

export default function DocumentViewer({documentURL}: DialogProps) {
  return (
    <div>
      {documentURL ? (
        <Document file={documentURL}>
          <Page pageNumber={1} /> {/* Displays only the first page */}
        </Document>
      ) : (
        <p>Cargando documento...</p>
      )}
    </div>
  );
}