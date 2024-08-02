import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

function App() {
    const [jsonInput, setJsonInput] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);

    const options = [
        { value: 'Alphabets', label: 'Alphabets' },
        { value: 'Numbers', label: 'Numbers' },
        { value: 'HighestAlphabet', label: 'Highest Alphabet' }
    ];

    const handleInputChange = (e) => {
        setJsonInput(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            const parsedJson = JSON.parse(jsonInput);
            if (!parsedJson.data) {
                throw new Error('Invalid JSON: Missing "data" key');
            }
            console.log("Sending request with payload:", parsedJson); // Logging for debugging
            const res = await axios.post('http://localhost:3001/bfhl', parsedJson);
            console.log("Received response:", res.data); // Logging for debugging
            setResponse(res.data);
            setError('');
        } catch (err) {
            console.error("Error:", err); // Logging for debugging
            setError(err.message || 'Invalid JSON');
        }
    };

    const handleOptionChange = (selectedOptions) => {
        setSelectedOptions(selectedOptions || []);
    };

    const filterData = () => {
        if (!response) return {};

        const options = {
            Alphabets: response['alphabets'],
            Numbers: response['numbers'],
            HighestAlphabet: response['highest_alphabet']
        };

        const filteredResponse = {};

        selectedOptions.forEach(option => {
            if (option.value === 'Alphabets') {
                filteredResponse['Alphabets'] = options['Alphabets'];
            }
            if (option.value === 'Numbers') {
                filteredResponse['Numbers'] = options['Numbers'];
            }
            if (option.value === 'HighestAlphabet') {
                filteredResponse['HighestAlphabet'] = options['HighestAlphabet'];
            }
        });

        return filteredResponse;
    };

    const renderResponse = () => {
        if (!response) return null;

        const filteredResponse = filterData();

        console.log("Filtered response:", filteredResponse); // Logging for debugging

        return (
            <div style={{ marginTop: '20px', color: 'black' }}>
                <h3 style={{ color: 'blue' }}>Filtered Response:</h3>
                {Object.keys(filteredResponse).map(key => (
                    <div key={key} style={{ backgroundColor: 'white', borderLeft: '4px solid blue', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                        <strong>{key}:</strong> {Array.isArray(filteredResponse[key]) ? filteredResponse[key].join(', ') : filteredResponse[key]}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div style={{ padding: '20px', backgroundColor: 'white', color: 'black', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '80%' }}>
                <h1 style={{ color: 'blue', textAlign: 'left' }}>JSON Input</h1>
                <textarea
                    value={jsonInput}
                    onChange={handleInputChange}
                    rows="10"
                    cols="50"
                    style={{ width: '100%', borderColor: 'blue', borderRadius: '5px', padding: '10px', fontSize: '16px', backgroundColor: 'white', color: 'black' }}
                ></textarea>
                <br />
                <button 
                    onClick={handleSubmit} 
                    style={{ backgroundColor: 'blue', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}
                >
                    Submit
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div>
                    <h2 style={{ color: 'blue', textAlign: 'left' }}>Select Response Fields</h2>
                    <Select
                        isMulti
                        options={options}
                        onChange={handleOptionChange}
                        value={selectedOptions}
                        styles={{
                            control: (base) => ({
                                ...base,
                                borderColor: 'blue',
                                backgroundColor: 'white',
                                color: 'white',
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: 'white',
                            }),
                            multiValue: (base) => ({
                                ...base,
                                backgroundColor: 'blue',
                                color: 'white',
                            }),
                            multiValueLabel: (base) => ({
                                ...base,
                                color: 'white',
                            }),
                            multiValueRemove: (base) => ({
                                ...base,
                                color: 'white',
                                
                                    backgroundColor: 'skyblue',
                                    color: 'black',
                                
                            }),
                            menu: (base) => ({
                                ...base,
                                backgroundColor: 'white',
                                color: 'white',
                            }),
                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isFocused ? 'blue' : 'black',
                                color: state.isFocused ? 'white' : 'white',
                                ':active': {
                                    backgroundColor: 'blue',
                                },
                            }),
                        }}
                    />
                </div>

                {renderResponse()}
            </div>
        </div>
    );
}

export default App;
