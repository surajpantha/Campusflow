import AssignmentCard from "./AssignmentCard";

function AssignmentList({ assignments, onToggleStatus, onDelete, onEdit }) {
  return (
    <div>
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          title={assignment.title}
          description={assignment.description}
          priority={assignment.priority}
          status={assignment.status}
          dueDate={assignment.due_date}
          onComplete={() => onToggleStatus(assignment.id)}
          onDelete={() => onDelete(assignment.id)}
          onEdit={() => onEdit(assignment.id)}
        />
      ))}
    </div>
  );
}

export default AssignmentList;