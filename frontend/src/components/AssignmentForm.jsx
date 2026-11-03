
import { useState, useEffect } from "react";

function AssignmentForm({
  onAddAssignment,
  editingAssignment,
  onUpdateAssignment,
  onCancelEdit,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (editingAssignment) {
      setTitle(editingAssignment.title);
      setDescription(editingAssignment.description);
      setPriority(editingAssignment.priority);
      setDueDate(editingAssignment.due_date || "");
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
      };

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

  const inputStyles =
    "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Title */}
      <div>
        <label
          htmlFor="assignment-title"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Assignment Title
        </label>

        <input
          id="assignment-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Database Management Assignment"
          className={inputStyles}
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="assignment-description"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Description
        </label>

        <textarea
          id="assignment-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Add some details about your assignment..."
          rows="4"
          className={`${inputStyles} resize-y`}
        />
      </div>

      {/* Priority and Due Date */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

        <div>
          <label
            htmlFor="assignment-priority"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Priority
          </label>

          <select
            id="assignment-priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            className={inputStyles}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="assignment-due-date"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Due Date
          </label>

          <input
            id="assignment-due-date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className={inputStyles}
          />
        </div>

      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 pt-2">

        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {editingAssignment ? "Save Changes" : "Add Assignment"}
        </button>

        {editingAssignment && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>
        )}

      </div>
    </form>
  );
}

export default AssignmentForm;
