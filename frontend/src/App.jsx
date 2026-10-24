import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import TaskStats from './components/TaskStats';
import TaskFilters from './components/TaskFilters';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import DeleteModal from './components/DeleteModal';
import Toast from './components/Toast';
import { taskApi } from './services/api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [modalState, setModalState] = useState({ isOpen: false, task: null });
  const [deleteState, setDeleteState] = useState({ isOpen: false, task: null });
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  // Fetch all tasks from FastAPI /tasks
  const fetchTasks = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      const data = await taskApi.getTasks();
      // Ensure data is array
      setTasks(Array.isArray(data) ? data : []);
      if (isRefresh) {
        showToast('Tasks synchronized with server', 'info');
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
      showToast(err.message || 'Failed to load tasks from server', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Global hotkey 'N' to open New Task modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is in an input or textarea
      const tag = e.target.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if ((e.key === 'n' || e.key === 'N') && !modalState.isOpen && !deleteState.isOpen) {
        e.preventDefault();
        setModalState({ isOpen: true, task: null });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalState.isOpen, deleteState.isOpen]);

  // Toggle completion: Uses /tasks/{id}/done for marking complete, or PATCH /tasks/{id} for uncompleting
  const handleToggleStatus = async (task) => {
    const nextCompleted = !task.completed;
    try {
      let updatedTask;
      if (nextCompleted) {
        // Use the dedicated /tasks/{id}/done endpoint
        updatedTask = await taskApi.markTaskDone(task.id);
      } else {
        // Use PATCH /tasks/{id}
        updatedTask = await taskApi.updateTask(task.id, { completed: false });
      }

      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, ...updatedTask } : t))
      );

      showToast(
        nextCompleted
          ? `Completed "${task.title}"!`
          : `Reopened "${task.title}"`
      );
    } catch (err) {
      console.error('Failed to toggle status:', err);
      showToast(err.message || 'Failed to update task status', 'error');
    }
  };

  // Create or Update task
  const handleSaveTask = async (formData) => {
    setIsSaving(true);
    try {
      if (modalState.task) {
        // Update task via PATCH /tasks/{id}
        const updated = await taskApi.updateTask(modalState.task.id, formData);
        setTasks((prev) =>
          prev.map((t) => (t.id === modalState.task.id ? { ...t, ...updated } : t))
        );
        showToast(`Task #${modalState.task.id} updated successfully`);
      } else {
        // Create task via POST /tasks
        const created = await taskApi.createTask(formData);
        setTasks((prev) => [created, ...prev]);
        showToast(`New task created successfully`);
      }
      setModalState({ isOpen: false, task: null });
    } catch (err) {
      console.error('Failed to save task:', err);
      showToast(err.message || 'Failed to save task', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete task via DELETE /tasks/{id}
  const handleConfirmDelete = async () => {
    if (!deleteState.task) return;
    setIsDeleting(true);
    try {
      await taskApi.deleteTask(deleteState.task.id);
      setTasks((prev) => prev.filter((t) => t.id !== deleteState.task.id));
      showToast(`Task #${deleteState.task.id} deleted`);
      setDeleteState({ isOpen: false, task: null });
    } catch (err) {
      console.error('Failed to delete task:', err);
      showToast(err.message || 'Failed to delete task', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter and sort calculation
  const counts = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    return {
      all: total,
      completed,
      pending: total - completed,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Status filter
        if (statusFilter === 'pending' && task.completed) return false;
        if (statusFilter === 'completed' && !task.completed) return false;

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const titleMatch = (task.title || '').toLowerCase().includes(q);
          const descMatch = (task.description || '').toLowerCase().includes(q);
          if (!titleMatch && !descMatch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          // If created_at exists sort by date, otherwise by id desc
          if (a.created_at && b.created_at) {
            return new Date(b.created_at) - new Date(a.created_at);
          }
          return b.id - a.id;
        }
        if (sortBy === 'oldest') {
          if (a.created_at && b.created_at) {
            return new Date(a.created_at) - new Date(b.created_at);
          }
          return a.id - b.id;
        }
        if (sortBy === 'title-asc') {
          return (a.title || '').localeCompare(b.title || '');
        }
        if (sortBy === 'title-desc') {
          return (b.title || '').localeCompare(a.title || '');
        }
        return 0;
      });
  }, [tasks, statusFilter, searchQuery, sortBy]);

  return (
    <div className="app-layout">
      <Header
        onOpenCreate={() => setModalState({ isOpen: true, task: null })}
        onRefresh={() => fetchTasks(true)}
        isRefreshing={isRefreshing}
        taskCount={tasks.length}
      />

      <main className="main-content">
        <TaskStats tasks={tasks} />

        <TaskFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          counts={counts}
        />

        <TaskList
          tasks={filteredTasks}
          isLoading={isLoading}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onToggleStatus={handleToggleStatus}
          onEdit={(task) => setModalState({ isOpen: true, task })}
          onDelete={(task) => setDeleteState({ isOpen: true, task })}
          onOpenCreate={() => setModalState({ isOpen: true, task: null })}
          onResetFilters={() => {
            setSearchQuery('');
            setStatusFilter('all');
          }}
        />
      </main>

      {/* Task Modal (Create / Edit) */}
      <TaskModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, task: null })}
        onSave={handleSaveTask}
        task={modalState.task}
        isSaving={isSaving}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteState.isOpen}
        onClose={() => setDeleteState({ isOpen: false, task: null })}
        onConfirm={handleConfirmDelete}
        task={deleteState.task}
        isDeleting={isDeleting}
      />

      {/* Action Toasts */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
