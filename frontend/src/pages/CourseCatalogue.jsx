import { useState } from "react";
import StudentCourseCard from "../components/StudentCourseCard";
import { useStudentCourses } from "../hooks/useStudentCourse";

function CourseCatalogue() {
    const {
        availableCourses,
        enrolledCourseIds,
        loading,
        error,
        enrollInCourse,

    } = useStudentCourses();
    const [enrollingCourseId, setEnrollingCourseId] = useState(null);
    const [actionError, setActionError] = useState(null);

    async function handleEnroll(courseId) {
        try {
            setEnrollingCourseId(courseId);
            setActionError(null);
            await enrollInCourse(courseId);
        } catch (err) {
            setActionError(err.message);

        } finally {
            setEnrollingCourseId(null);
        }
    }

    if (loading) {
        return <p className="py-10 text-center text-slate-500">
            Loading courses...
        </p>;
    }

    return (
        <div className="space-y-8">
            <header>
                <p className="text-sm font-medium text-indigo-600">
                    LEARNING
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                    Course Catalogue
                </h1>

                <p className="mt-2 text-slate-500">
                    Discover courses and start learning.
                </p>
            </header>

            {(error || actionError) && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {actionError || error}
                </div>
            )}

            {availableCourses.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                    <h2 className="font-semibold text-slate-900">
                        No courses available
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Check back later when teachers publish courses.
                    </p>
                </div>
            ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {availableCourses.map(course => (
                        <StudentCourseCard
                            key={course.id}
                            course={course}
                            enrolled={enrolledCourseIds.has(course.id)}
                            onEnroll={handleEnroll}
                            loading={enrollingCourseId === course.id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default CourseCatalogue;