import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../constants';
import { Link } from 'react-router-dom';

function AddAssignment(props) {
    console.log("AddAssignment function started...");

    const [assignments, setAssignments] = useState([]);
    const [message, setMessage] = useState('');

    let assignmentId = 0;

    useEffect(() => {
        fetchAssignments()
    }, []);

    const fetchAssignments = () => {
        setMessage('');
        console.log("fetchAssignments for ID: " + assignmentId);

        // gets assignments
        fetch(`${SERVER_URL}/assignment/${assignmentId}`)
            .then((response) => response.json())
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            
    }

    const onChangeInput = (e) => {
        console.log("onChangeInput function started...");
        setMessage('');

        // for input change
        setAssignments((prevAssignments) => ({
            ...prevAssignments,
            [e.target.name]: e.target.value
        }));
    }

    const saveAssignment = () => {
        console.log("Saving assignment...");
        setMessage('');
    
        // saves assignment to database using POST method
        fetch(`${SERVER_URL}/assignment/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("jwt")}`
            },
            body: JSON.stringify(assignments)
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            console.log('Assignment added successfully:', data);
            fetchAssignments();
            setMessage("Assignment added.");
        })
        .catch(err => {
            setMessage(`Save error: ${err.message}`);
            console.error('Save assignment error:', err);
        });
    };    

    const headers = ['Assignment Name', 'Due Date', 'courseID'];

    return (
        <div>
            {<Link to={`/`} > Return to list view </Link>}
            <h3>Add Assignments</h3>
            <div margin="auto" >
                <h4>{message}&nbsp;</h4>
                <table className="Center">
                    <thead>
                        <tr>
                            {headers.map((title, idx) => (<th key={idx}>{title}</th>))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input name="assignmentName" id="assignmentName"
                                    type="text"
                                    onChange={(e) => onChangeInput(e)} />
                            </td>
                            <td>
                                <input name="dueDate" id="dueDate"
                                    type="text"
                                    onChange={(e) => onChangeInput(e)} />
                            </td>
                            <td>
                                <input name="courseId" id="courseId"
                                    type="text"
                                    onChange={(e) => onChangeInput(e)} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button id="sassignment" type="button" margin="auto" onClick={saveAssignment}>Add Assignment</button>
            </div>
        </div>
    );
}

export default AddAssignment;