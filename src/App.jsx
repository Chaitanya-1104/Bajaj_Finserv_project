import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [isValidJson, setIsValidJson] = useState(true);
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Function to validate and parse JSON input
  const handleJsonInput = (e) => {
    const input = e.target.value;
    setJsonInput(input);
    try {
      JSON.parse(input); // Try parsing the JSON
      setIsValidJson(true);
    } catch (err) {
      setIsValidJson(false); // Set the flag to false if JSON is invalid
    }


    

  };

  // Handle form submission to send the request
  const handleSubmit = async () => {
    if (isValidJson) {
      try {
        const parsedJson = JSON.parse(jsonInput);  // Parse the input before sending it
        const response = await axios.post('https://backend-qsub.onrender.com/bfhl', parsedJson); // Adjust this URL to match your backend
        setResponseData(response.data);
        setErrorMessage('');
      } catch (error) {
        console.error('Error making API call:', error);
        setErrorMessage('Failed to get response from API');
      }
    } else {
      setErrorMessage('Invalid JSON format');
    }
  };

  // Handle dropdown selection change
  const handleOptionChange = (e) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedOptions(options);
  };

  // Render the response based on selected filters
  const renderResponse = () => {
    if (!responseData) return null;

    const { numbers, alphabets, highest_lowercase_alphabet } = responseData;
    let output = [];

    if (selectedOptions.includes('Alphabets')) {
      output.push(<div key="alphabets">Alphabets: {alphabets.join(', ')}</div>);
    }
    if (selectedOptions.includes('Numbers')) {
      output.push(<div key="numbers">Numbers: {numbers.join(', ')}</div>);
    }
    if (selectedOptions.includes('Highest lowercase alphabet')) {
      output.push(
        <div key="highest-lowercase">
          Highest Lowercase Alphabet: {highest_lowercase_alphabet.length > 0 ? highest_lowercase_alphabet[0] : 'None'}
        </div>
      );
    }

    return output;
  };

  return (
    <div className="App">
      <h1>Submit your JSON Data</h1>

      {/* Text Input for JSON */}
      <textarea
        rows="6"
        cols="50"
        value={jsonInput}
        onChange={handleJsonInput}  // Call handleJsonInput here
        placeholder='Enter JSON like {"data": ["A", "B", "C"]}'
      />
      {!isValidJson && <p style={{ color: 'red' }}>Invalid JSON</p>}

      <br />

      <button onClick={handleSubmit}>Submit</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {responseData && (
        <div>
          <h2>Select Data to Display</h2>
          <select multiple onChange={handleOptionChange}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>

          <div>{renderResponse()}</div>
        </div>
      )}
    </div>
  );
}

export default App;
