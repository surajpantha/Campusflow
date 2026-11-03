

function AssignmentCard({
  title,
  description,
  priority,
  status,
  dueDate,
  onComplete,
  onDelete,
  onEdit }) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <p>
        Priority: {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </p>
      <p>
        Status: {status === "completed" ? "Completed" : "Pending"}
      </p>
      <p>Due date: {dueDate || "Not set"}</p>
      <button onClick={onComplete}>
        {status === "completed" ? "Mark as Pending" : "Mark as Completed"}
      </button>
      <button onClick={onDelete}>
        Delete
      </button>
      <button onClick={onEdit}>
        Edit
      </button>


    </div>
  )
}

export default AssignmentCard;