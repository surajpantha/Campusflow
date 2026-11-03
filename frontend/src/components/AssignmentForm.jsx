import { useState, useEffect } from "react";

function AssignmentForm({
  onAddAssignment,
  editingAssignment,
  onUpdateAssignment,
  onCancelEdit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  useEffect(() => {
    if (editingAssignment) {
      setTitle(editingAssignment.title);
      setDescription(editingAssignment.description);
      setPriority(editingAssignment.priority);
      setDueDate(editingAssignment.due_date);
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
    }
  }, [editingAssignment]);


  function handleSubmit(event) {
    event.preventDefault();


    if (title.trim() === "") {
      alert("Please enter an assignment title");
      return;
    }

    if (editingAssignment) {
      const updatedAssignment = {
        ...editingAssignment,
        title: title.trim(),
        description,
        priority,
        due_date: dueDate,
      }
      onUpdateAssignment(updatedAssignment);

    } else {

      const newAssignment = {
        id: Date.now(),
        title: title.trim(),
        description,
        priority,
        due_date: dueDate,
        status: "pending",
      };
      onAddAssignment(newAssignment);
       setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
        
    }


  }


  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Assignment title"
      />

      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Description"
      />

      <select
        value={priority}
        onChange={(event) => setPriority(event.target.value)}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
      />

      <button type="submit">
        {editingAssignment ? "Save Changes" : "Add Assignment"}
      </button>
      {editingAssignment ?
        <button type="button" onClick={onCancelEdit}>
          Cancel
        </button> :
        ""
      }

    </form>
  );

}

export default AssignmentForm