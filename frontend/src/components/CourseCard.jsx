
function CourseCard({
    course,
    onEdit,
    onToggleStatus,
    onDelete,
}) {
    return (
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        {course.title}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        {course.description || 'No description provided.'}
                    </p>
                </div>

                <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                        course.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                    }`}
                >
                    {course.is_active ? 'Active' : 'Inactive'}
                </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <button
                    type="button"
                    onClick={() => onEdit(course)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                    Edit
                </button>

                <button
                    type="button"
                    onClick={() => onToggleStatus(course)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                    {course.is_active ? 'Deactivate' : 'Activate'}
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(course)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                    Delete
                </button>
            </div>
        </article>
    );
}

export default CourseCard;
