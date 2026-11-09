

import '../App.css'

import AssignmentForm from "../components/AssignmentForm";
import AssignmentList from "../components/AssignmentList";
import DashboardStats from '../components/DashboardStats';
import useAssignmentManagement from "../hooks/useAssignmentManagement";







function Dashboard() {

  const {
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
  } = useAssignmentManagement();

  const stats = assignments.reduce((acc, assignment) => {
    acc.total += 1;
    if (assignment.status === 'completed') {
      acc.completed += 1;
    } else if (assignment.status === 'pending') {
      acc.pending += 1;
    }
    if (assignment.priority === "low") {
      acc.low += 1;
    } else if (assignment.priority === "medium") {
      acc.medium += 1;
    } else if (assignment.priority === "high") {
      acc.high += 1;
    }

    return acc;
  }, {
    total: 0,
    completed: 0,
    pending: 0,
    low: 0,
    medium: 0,
    high: 0
  });


  

  return (
    <div className="space-y-8">

      {/* Dashboard heading */}
      <header>
        <p className="text-sm font-medium text-indigo-600">
          STUDENT WORKSPACE
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Welcome back!
        </h1>

        <p className="mt-2 text-slate-500">
          Here's an overview of your academic progress.
        </p>
      </header>

      {/* Statistics */}
      <DashboardStats stats={stats} />

      {/* Assignment management */}
      <section className="space-y-5">

        {/* Section heading */}
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            My Assignments
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Keep track of your tasks and upcoming deadlines.
          </p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row">

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

        </div>

        {/* Assignment list or empty states */}
        {assignments.length === 0 ? (

          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              No assignments yet
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Create your first assignment to get started.
            </p>
          </div>

        ) : sortedAssignments.length === 0 ? (

          <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center">
            <h3 className="font-semibold text-slate-800">
              No matching assignments
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>

        ) : (

          <AssignmentList
            assignments={sortedAssignments}
            onToggleStatus={toggleStatus}
            onDelete={deleteAssignment}
            onEdit={startEditing}
          />

        )}

      </section>

      {/* Assignment creation and editing form */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-slate-900">
          {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
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



export default Dashboard
