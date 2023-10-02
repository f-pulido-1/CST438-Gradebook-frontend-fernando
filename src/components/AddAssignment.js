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
            .then((data) => { setAssignments(Array.isArray(data) ? data : [data]) })
            .catch(err => {
                setMessage("Exception. " + err);
                console.error("fetch assignments error " + err);
            });
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
        console.log("Assignment.save ");

        // saves assignment to database using POST method
        fetch(`${SERVER_URL}/assignment/`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(assignments)
            })
            .then(res => {
                if (res.ok) {
                    fetchAssignments();
                    setMessage("Assignment added.");
                } else {
                    setMessage("Save error. " + res.status);
                    console.error('Save assignment error =' + res.status);
                }
            })
            .catch(err => {
                setMessage("Exception. " + err);
                console.error('Save assignment exception =' + err);
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
                                <input name="assignmentName"
                                    type="text"
                                    onChange={(e) => onChangeInput(e)} />
                            </td>
                            <td>
                                <input name="dueDate"
                                    type="text"
                                    onChange={(e) => onChangeInput(e)} />
                            </td>
                            <td>
                                <input name="courseId"
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