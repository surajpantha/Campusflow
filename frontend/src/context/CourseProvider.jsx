import { useEffect, useState } from 'react';
import { CourseContext } from './CourseContext';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export function CourseProvider({ children }) {
    const { user, loading: authLoading } = useAuth();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isActive = true;

        async function fetchCourses() {
            if (authLoading) return;

            if (!user) {
                setCourses([]);
                setLoading(false);
                setError(null);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const data = await api.get('/courses/');

                if (isActive) {
                    setCourses(
                        Array.isArray(data) ? data : data.results ?? []
                    );
                }
            } catch (err) {
                if (isActive) {
                    setError(err.message);
                    setCourses([]);
                }
            } finally {
                if (isActive) setLoading(false);
            }
        }

        fetchCourses();

        return () => {
            isActive = false;
        };
    }, [user, authLoading]);

    async function addCourse(courseData) {
        try {
            const createdCourse = await api.post('/courses/', courseData);

            setCourses((previous) => [...previous, createdCourse]);
            setError(null);

            return createdCourse;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    async function updateCourse(id, courseData) {
        try {
            const updatedCourse = await api.patch(
                `/courses/${id}/`,
                courseData
            );

            setCourses((previous) =>
                previous.map((course) =>
                    course.id === id ? updatedCourse : course
                )
            );

            setError(null);
            return updatedCourse;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    async function toggleCourseStatus(course) {
        return updateCourse(course.id, {
            is_active: !course.is_active,
        });
    }

    async function deleteCourse(id) {
        try {
            await api.delete(`/courses/${id}/`);

            setCourses((previous) =>
                previous.filter((course) => course.id !== id)
            );

            setError(null);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    return (
        <CourseContext.Provider
            value={{
                courses,
                loading,
                error,
                addCourse,
                updateCourse,
                toggleCourseStatus,
                deleteCourse,
            }}
        >
            {children}
        </CourseContext.Provider>
    );
}