import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../constants';
import { Link } from 'react-router-dom';

function DeleteAssignment(props) {
    console.log("DeleteAssignment function started...");

    const [assignments, setAssignments] = useState([]);
    let assignmentId = 0;
    const [message, setMessage] = useState('');

    // sets assignmentId to Id retrieved from list view
    const path = window.location.pathname;
    const s = /\d+$/.exec(path)[0];
    assignmentId = s;

    useEffect(() => {
        fetchAssignments()
    }, []);

    const fetchAssignments = () => {
        setMessage('');
        console.log("fetchAssignments for ID: " + assignmentId);
        fetch(`${SERVER_URL}/assignment/${assignmentId}`)
            .then((response) => response.json())
            .then((data) => { setAssignments(data) })
            .catch(err => {
                setMessage("Exception. " + err);
                console.error("fetch assignments error " + err);
            });
    }

    const deleteAssignment = () => {
        setMessage('');
        console.log("Assignment.delete ");

        // Deletes assignment from database using DELETE method
        fetch(`${SERVER_URL}/assignment/${assignmentId}`,
            {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', }
            })
            .then(res => {
                if (res.ok) {
                    fetchAssignments();
                    setMessage("Assignment deleted. You may return to list view.");
                } else {
                    setMessage("Delete error. " + res.status + ". Assignment may have existing grades.");
                    console.error('delete assignment error =' + res.status);
                }
            })
            .catch(err => {
                setMessage("Exception. " + err);
                console.error('delete assignment exception =' + err);
            });
    };

    const headers = ['Assignment Name', 'Due Date', 'courseID'];

    return (
        <div>
            {<Link to={`/`} > Return to list view </Link>}
            <h3>Delete Assignments</h3>
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
                                {assignments.assignmentName}
                            </td>
                            <td>
                                {assignments.dueDate}
                            </td>
                            <td>
                                {assignments.courseId}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button id="dassignment" type="button" margin="auto" onClick={deleteAssignment}>Delete Assignment</button>
            </div>
        </div>
    );
}

export default DeleteAssignment;