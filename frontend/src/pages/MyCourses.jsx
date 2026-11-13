import { useState } from "react";
import { useStudentCourses } from "../hooks/useStudentCourse";
import { Link } from "react-router";


function MyCourses() {
    const {
        enrollments,
        loading,
        error,
        leaveCourse,
    } = useStudentCourses();


    const [leavingEnrollmentId, setLeavingEnrollmentId] = useState(null);
    const [actionError, setActionError] = useState(null);

    async function handleLeave(enrollment) {
        const confirmed = window.confirm(
            `Are you sure you want to leave "${enrollment.course_details.title}"?`
        );

        if (!confirmed) return;


        try {
            setLeavingEnrollmentId(enrollment.id);
            setActionError(null);

            await leaveCourse(enrollment.id);

        } catch (err) {
            setActionError(err.message);

        } finally {
            setLeavingEnrollmentId(null);
        }
    }
    if (loading) {
        return <p className="py-10 text-center text-slate-500">
            Loading your courses...
        </p>;
    }

    return (
        <div className="space-y-8">
            <header>
                <p className="text-sm font-medium text-indigo-600">
                    YOUR LEARNING
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                    My Courses
                </h1>

                <p className="mt-2 text-slate-500">
                    Manage the courses you have joined.
                </p>
            </header>

            {(error || actionError) && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {actionError || error}
                </div>
            )}

            {enrollments.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                    <h2 className="font-semibold text-slate-900">
                        You haven't enrolled in any courses yet
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Explore the course catalogue to get started.
                    </p>
                </div>
            ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {enrollments.map(enrollment => {
                        const course = enrollment.course_details;

                        return (
                            <article
                                key={enrollment.id}
                                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <Link
                                    to={`/courses/${course.id}`}
                                    className="block rounded-lg transition hover:opacity-80"
                                >
                                    <h2 className="text-lg font-bold text-slate-900">
                                        {course.title}
                                    </h2>

                                    <p className="mt-2 text-sm text-slate-500">
                                        {course.description || "No description provided."}
                                    </p>

                                    <p className="mt-4 text-sm text-slate-500">
                                        Teacher: {course.teacher_username}
                                    </p>

                                    <p className="mt-3 text-sm font-medium text-indigo-600">
                                        Open Course →
                                    </p>
                                </Link>

                                <p className="mt-2 text-xs text-slate-400">
                                    Enrolled: {new Date(
                                        enrollment.enrolled_at
                                    ).toLocaleDateString()}
                                </p>

                                <div className="mt-5 border-t border-slate-100 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => handleLeave(enrollment)}
                                        disabled={leavingEnrollmentId === enrollment.id}
                                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                                    >
                                        {leavingEnrollmentId === enrollment.id
                                            ? 'Leaving...'
                                            : 'Leave Course'}
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MyCourses;