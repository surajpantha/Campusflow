import { useState } from 'react';

function CourseForm(props) {
    const { editingCourse } = props;

    const formKey = editingCourse
        ? `edit-${editingCourse.id}`
        : 'new';

    return <CourseFormFields key={formKey} {...props} />;
}

function CourseFormFields({
    editingCourse,
    onAddCourse,
    onUpdateCourse,
    onCancelEdit,
}) {
    const [title, setTitle] = useState(
        () => editingCourse?.title || ''
    );
    const [description, setDescription] = useState(
        () => editingCourse?.description || ''
    );
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        if (!title.trim()) return;

        setSubmitting(true);

        try {
            const courseData = {
                title: title.trim(),
                description: description.trim(),
            };

            if (editingCourse) {
                await onUpdateCourse(editingCourse.id, courseData);
            } else {
                await onAddCourse(courseData);
            }

            setTitle('');
            setDescription('');
        } catch (err) {
            alert(err.message || 'Could not save course.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="course-title"
                    className="mb-1 block text-sm font-medium text-slate-700"
                >
                    Course Title
                </label>

                <input
                    id="course-title"
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="e.g. Introduction to Python"
                    required
                    maxLength={200}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
            </div>

            <div>
                <label
                    htmlFor="course-description"
                    className="mb-1 block text-sm font-medium text-slate-700"
                >
                    Description
                </label>

                <textarea
                    id="course-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Describe what students will learn..."
                    rows={4}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
            </div>

            <div className="flex flex-wrap gap-3">
                <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                    {submitting
                        ? 'Saving...'
                        : editingCourse
                            ? 'Save Changes'
                            : 'Create Course'}
                </button>

                {editingCourse && (
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}

export default CourseForm;