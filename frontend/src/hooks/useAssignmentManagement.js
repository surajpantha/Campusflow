import { useState, useContext } from "react";
import { AssignmentContext } from "../context/AssignmentContext";
function useAssignmentManagement() {
    const {
        assignments,
        addAssignment,
        deleteAssignment,
        toggleStatus,
        updateAssignment
    } = useContext(AssignmentContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [editingAssignment, setEditingAssignment] = useState(null);
   
   
    function startEditing(id) {
        const selectedAssignment = assignments.find(
            (assignment) => assignment.id === id
        );

        setEditingAssignment(selectedAssignment);
    }

    // Cancel editing
    function cancelEditing() {
        setEditingAssignment(null);
    }

    // Update shared data and exit editing mode
    function handleUpdateAssignment(updatedAssignment) {
        updateAssignment(updatedAssignment);
        setEditingAssignment(null);
    }

    return {
        assignments,
        addAssignment,
        deleteAssignment,
        toggleStatus,
        updateAssignment,

        searchTerm,
        setSearchTerm,
        priorityFilter,
        setPriorityFilter,
        statusFilter,
        setStatusFilter,
        editingAssignment,
        setEditingAssignment,

        startEditing,
        cancelEditing,
        handleUpdateAssignment,
    };

}

export default useAssignmentManagement;