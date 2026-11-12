function StudentCourseCard({
    course,
    enrolled,
    onEnroll,
    loading,
}) {
    return (
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        {course.title}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        {course.description || 'No description provided.'}
                    </p>
                </div>

                <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    Active
                </span>
            </div>

            <p className="mt-4 text-sm text-slate-500">
                Teacher: {course.teacher_username}
            </p>

            <div className="mt-5 border-t border-slate-100 pt-4">
                {enrolled ? (
                    <span className="text-sm font-semibold text-green-700">
                        ✓ Already enrolled
                    </span>
                ) : (
                    <button
                        type="button"
                        onClick={() => onEnroll(course.id)}
                        disabled={loading}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? 'Enrolling...' : 'Enroll Now'}
                    </button>
                )}
            </div>
        </article>
    );
}

export default StudentCourseCard;