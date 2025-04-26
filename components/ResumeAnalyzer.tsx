'use client';

import React, { useState } from 'react';

const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file.');
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist/build/pdf');
        // Using PDF.js v5.1.91 worker URL directly from the CDN
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.1.91/pdf.worker.min.js';

        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n';
        }

        setResumeText(fullText);
        setFileUploaded(true);
      } catch (err) {
        console.error('PDF parse error:', err);
        alert('Failed to parse PDF.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const analyzeWithGemini = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCwPYJ7ipfcKWml7EWgz9n94JV5zRgMVYU',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a harsh recruiter and ATS bot. Analyze the following resume and give:
- ATS Score (out of 100)
- A harsh, blunt analysis of the resume
- 5 bullet points of improvement

Resume:
${resumeText}`
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setAnalysisResult(reply || 'No analysis returned.');
    } catch (err) {
      console.error('Gemini API error:', err);
      alert('Failed to analyze with Gemini.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Resume Analyzer with Gemini</h1>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />

      {fileUploaded && (
        <>
          <p style={{ color: 'green' }}>✅ Resume uploaded successfully.</p>
          <button
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
            onClick={analyzeWithGemini}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Start Analysis'}
          </button>
        </>
      )}

      {analysisResult && (
        <div style={{ marginTop: '2rem', whiteSpace: 'pre-wrap' }}>
          <h2>Analysis Result:</h2>
          <p>{analysisResult}</p>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
