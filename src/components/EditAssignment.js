import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../constants';
import { Link } from 'react-router-dom';

const EditAssignment = (props) => {
    console.log("EditAssignment function started...");
    const [assignment, setAssignment] = useState({}); // Change assignments to assignment
    let assignmentId = 0;
    const [message, setMessage] = useState('');

    // sets assignmentId to Id retrieved from list view
    const path = window.location.pathname;
    const s = /\d+$/.exec(path)[0];
    assignmentId = s;

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = () => {
        setMessage('');
        console.log("fetchAssignments for ID: " + assignmentId);

        // gets assignment
        fetch(`${SERVER_URL}/assignment/${assignmentId}`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem("jwt")}`,
                'Content-Type': 'application/json',
            },
        })        
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setAssignment(data); // Update state with the fetched assignment
            })
            .catch((error) => {
                console.error("Error fetching assignment:", error);
            });
    };

    const onChangeInput = (e) => {
        console.log("onChangeInput function started...");
        setMessage('');

        // for input change
        setAssignment((prevAssignment) => ({
            ...prevAssignment,
            [e.target.name]: e.target.value,
        }));
    };

    const updateAssignment = () => {
        console.log("Updating assignment...");
        setMessage('');
        console.log("Assignment.update ");

        // updates assignment in the database using PUT method
        fetch(`${SERVER_URL}/assignment/${assignmentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("jwt")}`
            },
            body: JSON.stringify(assignment), // Send the updated assignment
        })
            .then((res) => {
                if (res.ok) {
                    // Handle success
                    console.log("Assignment updated successfully.");
                    fetchAssignments();
                    setMessage("Assignment updated.");
                } else {
                    // Handle error
                    setMessage("Update error. " + res.status);
                    console.error('Update assignment error =' + res.status);
                }
            })
            .catch((err) => {
                // Handle exception
                setMessage("Exception. " + err);
                console.error('Update assignment exception =' + err);
            });
    };

    const headers = ['Assignment Name', 'Course Title', 'Due Date'];

    return (
        <div>
            <Link to={`/`} > Return to list view </Link>
            <h3>Edit Assignments</h3>
            <div margin="auto">
                <h4>{message}&nbsp;</h4>
                <table className="Center">
                    <thead>
                        <tr>
                            {headers.map((title, idx) => (
                                <th key={idx}>{title}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input
                                    name="assignmentName"
                                    value={assignment.assignmentName || ""}
                                    type="text"
                                    onChange={(e) => onChangeInput(e)}
                                />
                            </td>
                            <td>{assignment.courseTitle}</td>
                            <td>
                                <input
                                    name="dueDate"
                                    value={assignment.dueDate || ""}
                                    type="text"
                                    onChange={(e) => onChangeInput(e)}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button
                    id="uassignment"
                    type="button"
                    margin="auto"
                    onClick={updateAssignment}
                >
                    Update Assignment
                </button>
            </div>
        </div>
    );
};

export default EditAssignment;