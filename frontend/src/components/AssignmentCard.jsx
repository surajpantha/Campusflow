
function AssignmentCard({
  title,
  description,
  priority,
  status,
  dueDate,
  onComplete,
  onDelete,
  onEdit,
}) {
  const priorityStyles = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };

  const isCompleted = status === "completed";

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {/* Card header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className={`text-lg font-semibold ${
            isCompleted ? "text-gray-400 line-through" : "text-gray-800"
          }`}>
            {title}
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            {description || "No description provided."}
          </p>
        </div>

        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
          priorityStyles[priority] || "bg-gray-100 text-gray-700"
        }`}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
      </div>

      {/* Assignment details */}
      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
        <span className={`rounded-full px-3 py-1 font-medium ${
          isCompleted
            ? "bg-green-100 text-green-700"
            : "bg-blue-100 text-blue-700"
        }`}>
          {isCompleted ? "Completed" : "Pending"}
        </span>

        <span className="text-gray-500">
          Due: {dueDate || "Not set"}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
        <button
          onClick={onComplete}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          {isCompleted ? "Mark Pending" : "Complete"}
        </button>

        <button
          onClick={onEdit}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          Edit
        </button>

        <button
          onClick={onDelete}
          className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default AssignmentCard;
