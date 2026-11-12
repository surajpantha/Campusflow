import { useEffect, useState } from "react";
import { StudentCourseContext } from "./StudentCourseContext";
import { api } from '../services/api';
import { useAuth } from "../hooks/useAuth";


function getList(data) {
    if (Array.isArray(data)) {
        return data;
    }

    return data?.results ?? [];
}

export function StudentCourseProvider({ children }) {
    const { user, loading: authLoading } = useAuth();
    const [availableCourses, setAvailableCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isActive = true;

        async function fetchStudentCourses() {
            if (authLoading) return;

            if (!user) {
                setAvailableCourses([]);
                setEnrollments([]);
                setLoading(false);
                setError(null);
                return;
            }
            setLoading(true);
            setError(null);


            try {
                const [courseData, enrollmentData] = await Promise.all([
                    api.get('/available-courses/'),
                    api.get('/enrollments/'),
                ]);
                if (isActive) {
                    setAvailableCourses(getList(courseData));
                    setEnrollments(getList(enrollmentData));

                }
            } catch (err) {
                if (isActive) {
                    setError(err.message);
                    setAvailableCourses([]);
                    setEnrollments([]);
                }
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        }
        fetchStudentCourses();
        return () => {
            isActive = false;
        };
    }, [user, authLoading]);

    async function enrollInCourse(courseId) {
        try {
            setError(null);
            const enrollment = await api.post('/enrollments/', {
                course: courseId,
            });

            setEnrollments(previous => [
                ...previous,
                enrollment,
            ]);
            return enrollment;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    async function leaveCourse(enrollmentId) {
        try {
            setError(null);

            await api.delete(`/enrollments/${enrollmentId}/`);

            setEnrollments(previous =>
                previous.filter(
                    enrollment => enrollment.id !== enrollmentId
                )

            );
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    const enrolledCourseIds=new Set(
        enrollments.map(enrollment=>enrollment.course)
    );

    return(
        <StudentCourseContext.Provider
        value={{
            availableCourses,
            enrollments,
            enrolledCourseIds,
            loading,
            error,
            enrollInCourse,
            leaveCourse,
        }}>
            {children}
        </StudentCourseContext.Provider>
    );
}