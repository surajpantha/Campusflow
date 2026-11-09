
import { useState } from 'react';
import { CourseProvider} from '../context/CourseProvider';
import { useCourses } from '../hooks/useCourses';
import CourseCard from '../components/CourseCard';
import CourseForm from '../components/CourseForm';

function TeacherDashboardContent() {
    const {
        courses,
        loading,
        error,
        addCourse,
        updateCourse,
        toggleCourseStatus,
        deleteCourse,
    } = useCourses();

    const [editingCourse, setEditingCourse] = useState(null);
    const [actionError, setActionError] = useState(null);

    async function handleToggleStatus(course) {
        try {
            setActionError(null);
            await toggleCourseStatus(course);
        } catch (err) {
            setActionError(err.message);
        }
    }

    async function handleDeleteCourse(course) {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${course.title}"?`
        );

        if (!confirmed) return;

        try {
            setActionError(null);
            await deleteCourse(course.id);

            if (editingCourse?.id === course.id) {
                setEditingCourse(null);
            }
        } catch (err) {
            setActionError(err.message);
        }
    }

    async function handleUpdateCourse(id, courseData) {
        await updateCourse(id, courseData);
        setEditingCourse(null);
    }

    async function handleAddCourse(courseData) {
        await addCourse(courseData);
    }

    return (
        <div className="space-y-8">
            <header>
                <p className="text-sm font-medium text-indigo-600">
                    TEACHING WORKSPACE
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                    Teacher Dashboard
                </h1>

                <p className="mt-2 text-slate-500">
                    Manage your courses and teaching activities.
                </p>
            </header>

            <section className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="text-sm text-slate-500">Total Courses</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {loading ? '—' : courses.length}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="text-sm text-slate-500">Active Courses</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">
                        {loading
                            ? '—'
                            : courses.filter((course) => course.is_active).length}
                    </p>
                </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-bold text-slate-900">
                    {editingCourse ? 'Edit Course' : 'Create New Course'}
                </h2>

                <CourseForm
                    editingCourse={editingCourse}
                    onAddCourse={handleAddCourse}
                    onUpdateCourse={handleUpdateCourse}
                    onCancelEdit={() => setEditingCourse(null)}
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900">
                    My Courses
                </h2>

                {actionError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {actionError}
                    </div>
                )}

                {loading ? (
                    <p className="py-8 text-center text-slate-500">
                        Loading your courses...
                    </p>
                ) : error ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                        {error}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                        <h3 className="font-semibold text-slate-900">
                            No courses yet
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Create your first course using the form above.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {courses.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                onEdit={setEditingCourse}
                                onToggleStatus={handleToggleStatus}
                                onDelete={handleDeleteCourse}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

function TeacherDashboard() {
    return (
        <CourseProvider>
            <TeacherDashboardContent />
        </CourseProvider>
    );
}

export default TeacherDashboard;
