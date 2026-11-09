import { useEffect, useState } from 'react';
import { AssignmentContext } from './AssignmentContext';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export function AssignmentProvider({ children }) {
    const { user, loading: authLoading } = useAuth();

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isActive = true;

        async function fetchAssignments() {
            if (authLoading) return;

            if (!user) {
                setAssignments([]);
                setLoading(false);
                setError(null);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const data = await api.get('/assignments/');

                if (isActive) {
                    setAssignments(data);
                }
            } catch (err) {
                if (isActive) {
                    setError(err.message);
                    setAssignments([]);
                }
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        }

        fetchAssignments();

        return () => {
            isActive = false;
        };
    }, [user, authLoading]);

    async function addAssignment(newAssignment) {
        try {
            const createdAssignment = await api.post(
                '/assignments/',
                newAssignment
            );

            setAssignments((previous) => [
                ...previous,
                createdAssignment,
            ]);

            setError(null);
            return createdAssignment;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    async function deleteAssignment(id) {
        try {
            await api.delete(`/assignments/${id}/`);

            setAssignments((previous) =>
                previous.filter((assignment) => assignment.id !== id)
            );

            setError(null);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    async function toggleStatus(id) {
        const assignment = assignments.find(
            (item) => item.id === id
        );

        if (!assignment) return;

        const newStatus =
            assignment.status === 'completed'
                ? 'pending'
                : 'completed';

        try {
            const updatedAssignment = await api.patch(
                `/assignments/${id}/`,
                { status: newStatus }
            );

            setAssignments((previous) =>
                previous.map((item) =>
                    item.id === id ? updatedAssignment : item
                )
            );

            setError(null);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    async function updateAssignment(updatedAssignment) {
        const {
            id,
            title,
            description,
            due_date,
            priority,
            status,
        } = updatedAssignment;

        try {
            const savedAssignment = await api.patch(
                `/assignments/${id}/`,
                { title, description, due_date, priority, status }
            );

            setAssignments((previous) =>
                previous.map((item) =>
                    item.id === id ? savedAssignment : item
                )
            );

            setError(null);
            return savedAssignment;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    return (
        <AssignmentContext.Provider
            value={{
                assignments,
                addAssignment,
                deleteAssignment,
                toggleStatus,
                updateAssignment,
                loading,
                error,
            }}
        >
            {children}
        </AssignmentContext.Provider>
    );
}