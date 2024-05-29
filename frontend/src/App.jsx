import React, { useState } from 'react';
import axios from 'axios';
import uploadImage from './components/imageUpload';
import jsPDF from 'jspdf';

function App() {
  const [result, setResult] = useState('');
  const [editedResult, setEditedResult] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [recognize, setRecognize] = useState(true);
  const [upload, setUpload] = useState(true);
  const [uploaded, setUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isRecognized, setIsRecognized] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleReset = () => {
    setResult('');
    setEditedResult('');
    setUrl('');
    setImage('');
    setRecognize(true);
    setUpload(true);
    setUploaded(false);
    setIsUploading(false);
    setIsDownloading(false);
    setIsRecognizing(false);
    setIsRecognized(false);
    setIsEditing(false);
  };

  const handleFile = (e) => {
    setImage(e.target.files[0]);
    setUpload(false);
  }

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const durl = await uploadImage(image);
      setUrl(durl);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
      setRecognize(false);
      setUploaded(true);
    }
  }

  const recognizeHandwriting = async () => {
    setIsRecognizing(true);

    try {
      const response = await axios.get(`http://127.0.0.1:8000/ocr?url=${url}`);
      setResult(response.data);
      setEditedResult(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
    finally {
      setIsRecognized(true);
      setIsRecognizing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setResult(editedResult);
    setIsEditing(false);
  };

  const downloadPDF = async () => {
    setIsDownloading(true);

    try {
      const pdfContent = isEditing ? editedResult : result;

      const doc = new jsPDF();
      doc.text(pdfContent, 15, 15);
      const pdfUrl = doc.output('bloburl');

      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'download.pdf';
      link.click();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl mb-4 font-bold text-gray-800">
        Handwriting Recognition
      </h1>
      <input type="file" accept='image/*' onChange={handleFile} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
      <button onClick={handleUpload} disabled={upload} className={`bg-red-500 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out hover:bg-red-700 ${upload ? 'opacity-50 cursor-not-allowed' : ''}`}>
        Upload Image
      </button>
      {isUploading && <span className="text-sm text-gray-500">Uploading...</span>}
      <button
        className={`bg-blue-500 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out hover:bg-blue-700 ${recognize ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={recognizeHandwriting}
        disabled={recognize}
      >
        Recognize Handwriting
      </button>
      {isRecognizing && <span className="text-sm text-gray-500">Recognizing...</span>}
      {uploaded && <img src={url} alt="" className='w-[30vw] h-[50vh] mt-4 rounded shadow-lg'/>}
      {isEditing ? (
        <textarea
          value={editedResult}
          onChange={(e) => setEditedResult(e.target.value)}
          rows={4}
          cols={50}
          className="mt-4 p-2 w-full rounded border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        />
      ) : (
        <div className="mt-4 p-4 bg-gray-100 rounded shadow">
          <p className="text-gray-800">Result: {result}</p>
        </div>
      )}
      {isRecognized && (
        <>
          <button disabled={isDownloading} onClick={downloadPDF} className={`bg-amber-500 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out hover:bg-amber-700 ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            Download PDF
          </button>
          {isEditing ? (
            <button onClick={handleSaveEdit} className='ml-2 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300 ease-in-out'>Save</button>
          ) : (
            <button onClick={handleEdit} className='ml-2 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300 ease-in-out'>Edit</button>
          )}
        </>
      )}
      <button onClick={handleReset} disabled={upload} className={`mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out hover:bg-blue-700 ${upload ? 'opacity-50 cursor-not-allowed' : ''}`}>
        RESET
      </button>
    </div>
  );
}

export default App;
