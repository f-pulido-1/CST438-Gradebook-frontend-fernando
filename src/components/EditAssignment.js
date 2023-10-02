import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../constants';
import { Link } from 'react-router-dom';

function EditAssignment(props) {
    console.log("EditAssignment function started...");
    const [assignments, setAssignments] = useState([]);
    let assignmentId = 0;
    const [message, setMessage] = useState('');

    // sets assignmentId to Id retreived from list view
    const path = window.location.pathname;
    const s = /\d+$/.exec(path)[0];
    assignmentId = s;

    useEffect(() => {
        fetchAssignments()
    }, []);

    const fetchAssignments = () => {
        setMessage('');
        console.log("fetchAssignments for ID: " + assignmentId);

        // gets assignments
        fetch(`${SERVER_URL}/assignment/${assignmentId}`)
            .then((response) => response.json())
            .then((data) => { setAssignments(data) })
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

    const updateAssignment = () => {
        console.log("Updating assignment...")
        setMessage('');
        console.log("Assignment.update ");

        // updates assignment in database using PUT method
        fetch(`${SERVER_URL}/assignment/${assignmentId}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(assignments)
            })
            .then(res => {
                if (res.ok) {
                    fetchAssignments();
                    setMessage("Assignment updated.");
                } else {
                    setMessage("Update error. " + res.status);
                    console.error('Update assignment error =' + res.status);
                }
            })
            .catch(err => {
                setMessage("Exception. " + err);
                console.error('Update assignment exception =' + err);
            });
    };

    const headers = ['Assignment Name', 'Course Title', 'Due Date'];

    return (
        <div>
            {<Link to={`/`} > Return to list view </Link>}
            <h3>Edit Assignments</h3>
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
                                    value={(assignments.assignmentName) ? assignments.assignmentName : ""}
                                    type="text"
                                    onChange={(e) => onChangeInput(e)} />
                            </td>
                            <td>
                                {assignments.courseTitle}
                            </td>
                            <td>
                                <input name="dueDate"
                                    value={(assignments.dueDate) ? assignments.dueDate : ""}
                                    type="text"
                                    onChange={(e) => onChangeInput(e)} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button id="uassignment" type="button" margin="auto" onClick={updateAssignment}>Update Assignment</button>
            </div>
        </div>
    );
}

export default EditAssignment;