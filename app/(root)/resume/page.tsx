"use client";

import React, { useState } from 'react';

const GEMINI_API_KEY = "AIzaSyCwPYJ7ipfcKWml7EWgz9n94JV5zRgMVYU";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export default function ResumeAnalyzer() {
  const [fileText, setFileText] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const typedArray = new Uint8Array(reader.result as ArrayBuffer);

      if (!(window as any).pdfjsLib) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.1.91/pdf.min.js';
        script.onload = async () => extractText(typedArray);
        document.body.appendChild(script);
      } else {
        extractText(typedArray);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const extractText = async (typedArray: Uint8Array) => {
    try {
      const loadingTask = (window as any).pdfjsLib.getDocument({ data: typedArray });
      const pdf = await loadingTask.promise;

      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) => item.str);
        fullText += strings.join(' ') + '\n';
      }

      console.log('Extracted Text:', fullText);
      setFileText(fullText);
    } catch (err) {
      alert('Failed to extract text from PDF.');
    }
  };

  const handleAnalyze = async () => {
    if (!fileText.trim()) return alert('Please upload and load a resume first.');
    setLoading(true);

    const prompt = `Provide a harsh critique of this resume, assign an ATS score out of 100, and give actionable suggestions for improvement:\n\n${fileText}`;

    const res = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    const data = await res.json();
    const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.';
    setAnalysis(responseText);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Resume Harsh Analyzer</h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        className="block border rounded p-2 w-full"
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700"
      >
        {loading ? 'Analyzing...' : 'Analyze Resume'}
      </button>

      {analysis && (
        <div className="bg-gray-100 p-4 rounded whitespace-pre-wrap text-sm">
          {analysis}
        </div>
      )}
    </div>
  );
}
