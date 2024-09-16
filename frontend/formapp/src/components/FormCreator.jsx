// src/components/FormCreator.js

import React, { useState } from 'react';
import axios from 'axios';

const FormCreator = () => {
  const [questions, setQuestions] = useState([
    { question_text: '', question_type: 'custom', options: [] }
  ]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionsChange = (index, optionIndex, value) => {
    const updatedQuestions = [...questions];
    const updatedOptions = [...updatedQuestions[index].options];
    updatedOptions[optionIndex] = value;
    updatedQuestions[index].options = updatedOptions;
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options.push('');
    setQuestions(updatedQuestions);
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    const updatedOptions = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
    updatedQuestions[questionIndex].options = updatedOptions;
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question_text: '', question_type: 'custom', options: [] }]);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI2MzA3MTM4LCJpYXQiOjE3MjYzMDQxMzgsImp0aSI6ImViMTQ1MzM1M2Q4ZjRkNmRiMmZiNmFlNzhhYTg2ZWM3IiwidXNlcl9pZCI6Mn0.aXzFXNc5jAIL4dP49msBrKJF3PLd6q57PC6uoaZ0eUg'; // Replace with actual token logic
      const response = await axios.post(
        'http://localhost:8000/adminform/create/', 
        { questions },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      alert('Questions added successfully');
    } catch (error) {
      alert(`Error: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {questions.map((question, index) => (
          <div key={index} className="bg-white p-4 border rounded-md shadow-md">
            <div className="mb-2">
              <input
                type="text"
                placeholder="Question text"
                value={question.question_text}
                onChange={(e) => handleQuestionChange(index, 'question_text', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-2">
              <select
                value={question.question_type}
                onChange={(e) => handleQuestionChange(index, 'question_type', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="custom">Custom</option>
                <option value="dropdown">Dropdown</option>
                <option value="text">Text</option>
              </select>
            </div>
            {question.question_type === 'dropdown' && (
              <div className="mb-2">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center mb-2">
                    <input
                      type="text"
                      placeholder={`Option ${optionIndex + 1}`}
                      value={option}
                      onChange={(e) => handleOptionsChange(index, optionIndex, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index, optionIndex)}
                      className="ml-2 bg-red-500 text-white px-2 py-1 rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddOption(index)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Add Option
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => handleRemoveQuestion(index)}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Remove Question
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddQuestion}
          className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 flex items-center"
        >
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add Question
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormCreator;
