
import AssignmentList from "../components/AssignmentList";
import AssignmentForm from "../components/AssignmentForm";
import useAssignmentManagement from "../hooks/useAssignmentManagement";

function Assignments() {



  // Page-specific UI state
  const {
   assignments,
        addAssignment,
        deleteAssignment,
        toggleStatus,
       loading,
       error,

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
        sortedAssignments
  } = useAssignmentManagement();
 
 

  async function handleToggleStatus(id) {
    try {
        await toggleStatus(id);
    } catch {
        // The context already stores the error for display.
    }
}

async function handleDeleteAssignment(id) {
    try {
        await deleteAssignment(id);
    } catch {
        // The context already stores the error for display.
    }
}

  return (
    <div className="space-y-8">

      {/* Page heading */}
      <header>
        <p className="text-sm font-medium text-indigo-600">
          TASK MANAGEMENT
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          My Assignments
        </h1>

        <p className="mt-2 text-slate-500">
          Manage all your academic tasks and deadlines in one place.
        </p>
      </header>

      {/* Search and filters */}
      <section className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row">

        <input
          type="text"
          placeholder="Search assignments..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        <select
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

      </section>

      {/* Assignment list and empty states */}
     <section>
    {loading ? (
        <p className="py-10 text-center text-slate-500">
            Loading your assignments...
        </p>
    ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
            <p className="font-medium text-red-700">
                {error}
            </p>
        </div>
    ) : assignments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
                No assignments yet
            </h2>
            <p className="mt-2 text-sm text-slate-500">
                Create your first assignment below.
            </p>
        </div>
    ) : sortedAssignments.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center">
            <h2 className="font-semibold text-slate-800">
                No matching assignments
            </h2>
            <p className="mt-2 text-sm text-slate-500">
                Try changing your search or filters.
            </p>
        </div>
    ) : (
        <AssignmentList
            assignments={sortedAssignments}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteAssignment}
            onEdit={startEditing}
        />
    )}
</section>

      {/* Create and edit form */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-slate-900">
          {editingAssignment ? "Edit Assignment" : "Create New Assignment"}
        </h2>

        <AssignmentForm
          onAddAssignment={addAssignment}
          editingAssignment={editingAssignment}
          onUpdateAssignment={handleUpdateAssignment}
          onCancelEdit={cancelEditing}
        />
      </section>

    </div>
  );
}

export default Assignments;
