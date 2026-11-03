import { createContext, useState } from "react";

export const AssignmentContext = createContext();

export function AssignmentProvider({ children }) {
    const [assignments, setAssignments] = useState([]);

    function addAssignment(newAssignment) {
        setAssignments((previousAssignments) => [
            ...previousAssignments,
            newAssignment,
        ]);
    }
    function deleteAssignment(id) {
        setAssignments((prevAssignments) =>
            prevAssignments.filter(
                (assignment) => assignment.id !== id
            )
        );
    }
    function toggleStatus(id) {
        setAssignments((prevAssignments) =>
            prevAssignments.map((assignment) =>
                assignment.id === id
                    ? {
                        ...assignment,
                        status: assignment.status === "completed" ? "pending" : "completed"
                    } :
                    assignment
            ));
    }
    function updateAssignment(updatedAssignment) {
        setAssignments((prevAssignments) =>
            prevAssignments.map((assignment) =>
                assignment.id === updatedAssignment.id
                    ? updatedAssignment
                    : assignment
            )
        );
    }

    return (
        <AssignmentContext.Provider
            value={{
                assignments,
                addAssignment,
                deleteAssignment,
                toggleStatus,
                updateAssignment,
            }}
        >
            {children}
        </AssignmentContext.Provider>
    );
}