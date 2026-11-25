
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { api } from "../services/api";

function CourseDetail() {
    const { courseId } = useParams();

    const [course, setCourse] = useState(null);
    const [materials, setMaterials] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [downloadingId, setDownloadingId] = useState(null);
    const [downloadError, setDownloadError] = useState(null);



    useEffect(() => {
        let isActive = true;


        async function fetchCourseData() {
            setLoading(true);
            setError(null);
            setCourse(null);
            setMaterials([]);

            try {
                const [courseData, materialData] = await Promise.all([
                    api.get(`/course-access/${courseId}/`),
                    api.get(`/courses/${courseId}/materials/`),
                ]);

                if (isActive) {
                    setCourse(courseData);
                    setMaterials(materialData);
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

        fetchCourseData();

        return () => {
            isActive = false;
        };
    }, [courseId]);

    async function handleDownload(material) {
        setDownloadingId(material.id);
        setDownloadError(null);

        let objectUrl = null;


        try {
            const { blob, filename } = await api.download(
                `/courses/${courseId}/materials/${materials.id}/download/`
            );


            objectUrl = URL.createObjectURL(blob);

            const link = objectUrl;
            link.href = objectUrl;
            link.download = filename;


            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (err) {
            setDownloadError(err.message);

        } finally {
            if (objectUrl) {
                // Give the browser time to start the download.
                window.setTimeout(() => {
                    URL.revokeObjectURL(objectUrl);

                }, 1000);
            }
            setDownloadingId(null);
        }
    }

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

            {/* Course information */}
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

            {/* Learning materials */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">
                        Learning Materials
                    </h2>

                    <span className="text-sm text-slate-500">
                        {materials.length} available
                    </span>
                </div>

                {downloadError && (
                    <p
                        role="alert"
                        className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
                    >
                        {downloadError}
                    </p>
                )}

                {materials.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                        <h3 className="font-semibold text-slate-900">
                            No learning materials yet
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Your teacher hasn't published any materials for this course yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {materials.map((material) => (
                            <article
                                key={material.id}
                                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <div className="flex min-w-0 flex-1 items-start gap-4">
                                        <div className="rounded-lg bg-indigo-50 p-3">
                                            <span className="text-xl">
                                                📚
                                            </span>
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-slate-900">
                                                {material.title}
                                            </h3>

                                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                                {material.description ||
                                                    "No description provided."}
                                            </p>

                                            <p className="mt-3 text-xs text-slate-400">
                                                Added on{" "}
                                                {new Date(
                                                    material.created_at
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {material.has_file ? (
                                        <button
                                            type="button"
                                            onClick={() => handleDownload(material)}
                                            disabled={downloadingId !== null}
                                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {downloadingId === material.id
                                                ? "Downloading..."
                                                : "Download"}
                                        </button>
                                    ) : (
                                        <span className="shrink-0 text-sm text-slate-400">
                                            No file attached
                                        </span>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default CourseDetail;