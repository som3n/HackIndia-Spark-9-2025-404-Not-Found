'use client';

import React, { useState } from 'react';
import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyCwPYJ7ipfcKWml7EWgz9n94JV5zRgMVYU'; // Replace with your own key

const CoverLetterGenerator: React.FC = () => {
  const [name, setName] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [company, setCompany] = useState('');
  const [field, setField] = useState('');
  const [experience, setExperience] = useState('');
  const [platform, setPlatform] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);

  const generateCoverLetter = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !jobRole || !jobDescription || !company || !field || !experience || !platform) {
      alert('Please fill in all the fields.');
      return;
    }

    setLoading(true);
    setCoverLetter('');

    const prompt = `Write a professional cover letter without using any complex vocabulary, mostly as written by an actual human for ${name}, who is applying for the position of ${jobRole} at ${company} in the field of ${field}. The candidate has ${experience} years of experience and found this job through ${platform}. Use the following job description as reference:\n\n${jobDescription}\n\nOnly generate the body of the letter, no need for header, date, but add salutation only as "Dear Hiring Manager". Max of 300 words only.`;

    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            key: GEMINI_API_KEY,
          },
        }
      );

      const textResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No content generated.';
      setCoverLetter(textResponse);
    } catch (error) {
      console.error('Error generating cover letter:', error);
      setCoverLetter('Failed to generate cover letter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold">CoverAI</h1>
          <p className='text-sm mb-3'>Let's create your personalized Cover Letter</p>

          <form className="space-y-4" onSubmit={generateCoverLetter}>
            <InputField label="Your Name:" value={name} setValue={setName} placeholder="Your Name Here" />
            <InputField label="Job Role:" value={jobRole} setValue={setJobRole} placeholder="Job role you are applying for" />
            <InputField label="Company Name:" value={company} setValue={setCompany} placeholder="Name of the Company Applying for" />
            <InputField label="Field of Work:" value={field} setValue={setField} placeholder="Field applying for, like IT, Non-IT, etc" />
            <InputField label="Years of Experience:" value={experience} setValue={setExperience} placeholder="YoE" type="number" />
            <InputField label="Platform Where You Found This Job:" value={platform} setValue={setPlatform} placeholder="LinkedIn, Indeed, Company Website etc." />
            
            <label className="block">
              <span className="text-gray-300">Job Description:</span>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows={6}
                className="mt-1 block w-full p-2 border border-gray-700 bg-[#2e2e2e] rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
            >
              {loading ? 'Generating...' : 'Generate Cover Letter'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Generated Cover Letter</h2>
          <div className="bg-[#2e2e2e] p-4 rounded-md border border-gray-700 min-h-[200px]">
            {coverLetter ? (
              <pre className="whitespace-pre-wrap">{coverLetter}</pre>
            ) : (
              <p className="text-gray-400 min-h-[80vh]">Your generated cover letter will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface InputFieldProps {
  label: string;
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, setValue, placeholder = '', type = 'text' }) => (
  <label className="block">
    <span className="text-gray-300">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="mt-1 block w-full p-2 border border-gray-700 bg-[#2e2e2e] rounded-md focus:outline-none focus:ring focus:ring-blue-500"
    />
  </label>
);

export default CoverLetterGenerator;
