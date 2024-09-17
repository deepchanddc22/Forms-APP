import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ThemeToggle from '../components/ThemeToggle';

const FormCreator = () => {
  const [formName, setFormName] = useState(''); // Separate form name state
  const [questions, setQuestions] = useState([
    { question_text: '', question_type: 'custom', options: [] }
  ]);

  // Handle form name change
  const handleFormNameChange = (value) => {
    setFormName(value);
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionsChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push('');
    setQuestions(updatedQuestions);
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
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
      const authToken = localStorage.getItem('access_token');
      if (!authToken) {
        alert('No auth token found. Please log in again.');
        return;
      }

      // Construct the payload to match the backend's expected structure
      const payload = {
        form_name: formName, // You can include the form name here if needed
        questions: questions.map((q) => ({
          question_text: q.question_text,
          question_type: q.question_type,
          options: q.options.length > 0 ? q.options : undefined // Only include options if they exist
        })),
      };

      const response = await axios.post(
        'http://localhost:8000/adminform/create/',
        payload,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      alert('Form added successfully');
    } catch (error) {
      alert(`Error: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-black dark:text-white">
      <Navbar />
      <ThemeToggle /> {/* Add ThemeToggle here */}

      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Create Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form name input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Form name"
              value={formName}
              onChange={(e) => handleFormNameChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Questions */}
          {questions.map((question, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 border rounded-md shadow-md">
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Question text"
                  value={question.question_text}
                  onChange={(e) => handleQuestionChange(index, 'question_text', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div className="mb-2">
                <select
                  value={question.question_type}
                  onChange={(e) => handleQuestionChange(index, 'question_type', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="custom">Custom</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="text">Text</option>
                </select>
              </div>

              {/* Options for dropdown and custom questions */}
              {(question.question_type === 'dropdown' || question.question_type === 'custom') && (
                <div className="mb-2">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option}
                        onChange={(e) => handleOptionsChange(index, optionIndex, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
    </div>
  );
};

export default FormCreator;
