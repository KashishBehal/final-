import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleJsonInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const parsedInput = JSON.parse(jsonInput);
      if (!parsedInput || !Array.isArray(parsedInput.data)) {
        throw new Error('Invalid JSON input. Please ensure the data field is an array.');
      }

      setError('');
      const response = await axios.post('http://localhost:3001', parsedInput);
      setResponseData(response.data);
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(err.response.data.message || 'API error occurred');
      } else {
        setError('Successfully Data Uploaded');
      }
      setResponseData(null);
    }
  };

  const handleOptionChange = (e) => {
    const { value, checked } = e.target;
    setSelectedOptions((prev) =>
      checked ? [...prev, value] : prev.filter((option) => option !== value)
    );
  };

  const renderResponse = () => {
    if (!responseData) return null;

    const result = {};
    if (selectedOptions.includes('Alphabets')) {
      result.alphabets = responseData.alphabets;
    }
    if (selectedOptions.includes('Numbers')) {
      result.numbers = responseData.numbers;
    }
    if (selectedOptions.includes('Highest lowercase alphabet')) {
      result.highest_lowercase_alphabet = responseData.highest_lowercase_alphabet;
    }

    return (
      <div>
        <h3>Response Data</h3>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="app-container">
      <h1>{responseData?.roll_number || 'Your Roll Number'}</h1>

      <div className="form-container">
        <textarea
          className="json-input"
          rows="8"
          cols="50"
          value={jsonInput}
          onChange={handleJsonInputChange}
          placeholder='Enter JSON here...'
        />
        <br />
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
        {error && <p className="error-message">{error}</p>}
      </div>

      {responseData && (
        <div className="response-container">
          <h3>Filter Options</h3>
          <div className="checkbox-container">
            <label>
              <input type="checkbox" value="Alphabets" onChange={handleOptionChange} />
              Alphabets
            </label>
            <label>
              <input type="checkbox" value="Numbers" onChange={handleOptionChange} />
              Numbers
            </label>
            <label>
              <input type="checkbox" value="Highest lowercase alphabet" onChange={handleOptionChange} />
              Highest Lowercase Alphabet
            </label>
          </div>
          {renderResponse()}
        </div>
      )}
    </div>
  );
}

export default App;
