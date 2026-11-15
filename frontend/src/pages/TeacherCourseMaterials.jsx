
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { api } from "../services/api";

const initialForm = {
    title: "",
    description: "",
    is_published: true,
};

function TeacherCourseMaterials() {
    const { courseId } = useParams();

    const [course, setCourse] = useState(null);
    const [materials, setMaterials] = useState([]);

    const [formData, setFormData] = useState(initialForm);
    const [editingMaterial, setEditingMaterial] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState(null);
    const [actionError, setActionError] = useState(null);

    const materialsUrl = `/courses/${courseId}/materials/`;

    // Fetch course and its materials.
    useEffect(() => {
        let isActive = true;

        async function fetchData() {
            setLoading(true);
            setError(null);

            try {
                const [courseData, materialData] = await Promise.all([
                    api.get(`/course-access/${courseId}/`),
                    api.get(materialsUrl),
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

        fetchData();

        return () => {
            isActive = false;
        };
    }, [courseId,materialsUrl]);

    function handleChange(event) {
        const { name, value, type, checked } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function startEditing(material) {
        setEditingMaterial(material);

        setFormData({
            title: material.title,
            description: material.description,
            is_published: material.is_published,
        });

        setActionError(null);
    }

    function cancelEditing() {
        setEditingMaterial(null);
        setFormData(initialForm);
        setActionError(null);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            setSaving(true);
            setActionError(null);

            let savedMaterial;

            if (editingMaterial) {
                savedMaterial = await api.patch(
                    `${materialsUrl}${editingMaterial.id}/`,
                    formData
                );

                setMaterials((previous) =>
                    previous.map((material) =>
                        material.id === savedMaterial.id
                            ? savedMaterial
                            : material
                    )
                );
            } else {
                savedMaterial = await api.post(materialsUrl, formData);

                setMaterials((previous) => [
                    savedMaterial,
                    ...previous,
                ]);
            }

            cancelEditing();
        } catch (err) {
            setActionError(err.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleTogglePublish(material) {
        try {
            setActionError(null);

            const updatedMaterial = await api.patch(
                `${materialsUrl}${material.id}/`,
                {
                    is_published: !material.is_published,
                }
            );

            setMaterials((previous) =>
                previous.map((item) =>
                    item.id === updatedMaterial.id
                        ? updatedMaterial
                        : item
                )
            );

            if (editingMaterial?.id === material.id) {
                setEditingMaterial(updatedMaterial);

                setFormData((previous) => ({
                    ...previous,
                    is_published: updatedMaterial.is_published,
                }));
            }
        } catch (err) {
            setActionError(err.message);
        }
    }

    async function handleDelete(material) {
        const confirmed = window.confirm(
            `Delete "${material.title}"?`
        );

        if (!confirmed) return;

        try {
            setActionError(null);

            await api.delete(
                `${materialsUrl}${material.id}/`
            );

            setMaterials((previous) =>
                previous.filter((item) => item.id !== material.id)
            );

            if (editingMaterial?.id === material.id) {
                cancelEditing();
            }
        } catch (err) {
            setActionError(err.message);
        }
    }

    if (loading) {
        return (
            <p className="py-10 text-center text-slate-500">
                Loading course materials...
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
                    to="/teacher"
                    className="text-indigo-600 hover:underline"
                >
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <Link
                to="/teacher"
                className="text-sm font-medium text-indigo-600 hover:underline"
            >
                ← Back to Dashboard
            </Link>

            <header>
                <p className="text-sm font-medium text-indigo-600">
                    COURSE MANAGEMENT
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                    {course?.title}
                </h1>

                <p className="mt-2 text-slate-500">
                    Manage learning materials for this course.
                </p>
            </header>

            {/* Material form */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-bold text-slate-900">
                    {editingMaterial
                        ? "Edit Material"
                        : "Add New Material"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="title"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Material Title
                        </label>

                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            maxLength={200}
                            placeholder="e.g. Introduction to Python"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Describe what this material covers..."
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    <label className="flex items-center gap-3 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            name="is_published"
                            checked={formData.is_published}
                            onChange={handleChange}
                            className="h-4 w-4 accent-indigo-600"
                        />

                        Publish immediately
                    </label>

                    {actionError && (
                        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                            {actionError}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {saving
                                ? "Saving..."
                                : editingMaterial
                                    ? "Save Changes"
                                    : "Add Material"}
                        </button>

                        {editingMaterial && (
                            <button
                                type="button"
                                onClick={cancelEditing}
                                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </section>

            {/* Material list */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">
                        Course Materials
                    </h2>

                    <span className="text-sm text-slate-500">
                        {materials.length} materials
                    </span>
                </div>

                {materials.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                        <h3 className="font-semibold text-slate-900">
                            No materials yet
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Add your first learning material using the form above.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {materials.map((material) => (
                            <article
                                key={material.id}
                                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h3 className="font-semibold text-slate-900">
                                            {material.title}
                                        </h3>

                                        <p className="mt-2 text-sm text-slate-500">
                                            {material.description || "No description provided."}
                                        </p>
                                    </div>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                                            material.is_published
                                                ? "bg-green-100 text-green-700"
                                                : "bg-amber-100 text-amber-700"
                                        }`}
                                    >
                                        {material.is_published
                                            ? "Published"
                                            : "Draft"}
                                    </span>
                                </div>

                                <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => startEditing(material)}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleTogglePublish(material)}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        {material.is_published
                                            ? "Unpublish"
                                            : "Publish"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(material)}
                                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default TeacherCourseMaterials;
