import { useState, useContext } from "react";
import { AssignmentContext } from "../context/AssignmentContext";
function useAssignmentManagement() {
  const {
    assignments,
    addAssignment,
    deleteAssignment,
    toggleStatus,
    updateAssignment,
    loading,
    error,
} = useContext(AssignmentContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [editingAssignment, setEditingAssignment] = useState(null);


    function startEditing(id) {
        const selectedAssignment = assignments.find(
            (assignment) => assignment.id === id
        );
        if(!selectedAssignment) return;

        setEditingAssignment(selectedAssignment);
    }

    // Cancel editing
    function cancelEditing() {
        setEditingAssignment(null);
    }

    // Update shared data and exit editing mode
   async function handleUpdateAssignment(updatedAssignment) {
    await updateAssignment(updatedAssignment);
    setEditingAssignment(null);
}
    const filteredAssignments = assignments.filter((assignment) => {
        const matchesSearch = assignment.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesPriority =
            priorityFilter === "all" ||
            assignment.priority === priorityFilter;

        const matchesStatus =
            statusFilter === "all" ||
            assignment.status === statusFilter;

        return matchesSearch && matchesPriority && matchesStatus;
    });

    // Sort by due date
    const sortedAssignments = [...filteredAssignments].sort((a, b) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;

        return new Date(a.due_date) - new Date(b.due_date);
    });
    return {
        assignments,
        addAssignment,
        deleteAssignment,
        toggleStatus,
        

        searchTerm,
        setSearchTerm,
        priorityFilter,
        setPriorityFilter,
        statusFilter,
        setStatusFilter,
        editingAssignment,
      

        startEditing,
        cancelEditing,
        handleUpdateAssignment,

        sortedAssignments,
        loading,
        error,
        
    };

}

export default useAssignmentManagement;