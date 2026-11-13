
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { api } from "../services/api";

function CourseDetail() {
    const { courseId } = useParams();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        let isActive = true;


        async function fetchCourse() {
            setLoading(true);
            setError(null);
            setCourse(null);

            try {
                const data = await api.get(
                    `/course-access/${courseId}`
                );

                if (isActive) {
                    setCourse(data);

                }
            } catch (err) {
                if (isActive) {
                    setError(err.message);
                }
            } finally {
                if (isActive) {
                    setLoading(false);

                }
            }
        }

        fetchCourse();

        return () => {
            isActive = false;
        };
    }, [courseId])
    
    if (loading) {
        return (
            <p className="py-10 text-center text-slate-500">
                Loading course...
            </p>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <p className="rounded-lg bg-red-50 p-4 text-red-700">
                    {error}
                </p>

                <Link
                    to="/my-courses"
                    className="text-indigo-600 hover:underline"
                >
                    Back to My Courses
                </Link>
            </div>
        );
    }

    if (!course) {
        return <p>Course not found.</p>;
    }

    return (
        <div className="space-y-8">
            <Link
                to="/my-courses"
                className="text-sm font-medium text-indigo-600 hover:underline"
            >
                ← Back to My Courses
            </Link>

            <header className="rounded-2xl bg-white p-8 shadow-sm">
                <p className="text-sm font-medium text-indigo-600">
                    COURSE LEARNING SPACE
                </p>

                <h1 className="mt-3 text-3xl font-bold text-slate-900">
                    {course.title}
                </h1>

                <p className="mt-4 leading-7 text-slate-600">
                    {course.description || "No description provided."}
                </p>

                <div className="mt-6 border-t border-slate-100 pt-5">
                    <p className="text-sm text-slate-500">
                        Course instructor
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                        {course.teacher_username}
                    </p>
                </div>
            </header>

            <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8">
                <h2 className="text-xl font-bold text-slate-900">
                    Learning Materials
                </h2>

                <p className="mt-2 text-slate-500">
                    Your teacher's learning materials will appear here.
                </p>
            </section>
        </div>
    );
}

export default CourseDetail;