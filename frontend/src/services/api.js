/**
 * API Service for FastAPI Tasks backend
 * Endpoints from app.app:
 * - GET    /tasks
 * - POST   /tasks
 * - GET    /tasks/{id}
 * - PATCH  /tasks/{id}
 * - DELETE /tasks/{id}
 * - PATCH  /tasks/{id}/done
 */

const API_BASE = import.meta.env.VITE_API_BASE || '';

async function handleResponse(response) {
  if (!response.ok) {
    let errorDetail = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson && errJson.detail) {
        errorDetail = errJson.detail;
      } else if (errJson && errJson.message) {
        errorDetail = errJson.message;
      }
    } catch {
      // response wasn't JSON
    }
    throw new Error(errorDetail);
  }
  return response.json();
}

export const taskApi = {
  /**
   * Fetch all tasks (ordered by id desc from backend)
   */
  async getTasks() {
    const res = await fetch(`${API_BASE}/tasks`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse(res);
  },

  /**
   * Get a specific task by ID
   */
  async getTaskById(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse(res);
  },

  /**
   * Create a new task
   * @param {{ title: string, description?: string }} data
   */
  async createTask(data) {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        title: data.title.trim(),
        description: data.description ? data.description.trim() : null,
      }),
    });
    return handleResponse(res);
  },

  /**
   * Update task fields (title, description, completed)
   * @param {number} id
   * @param {{ title?: string, description?: string, completed?: boolean }} data
   */
  async updateTask(id, data) {
    const body = {};
    if (data.title !== undefined) body.title = data.title.trim();
    if (data.description !== undefined) body.description = data.description ? data.description.trim() : null;
    if (data.completed !== undefined) body.completed = Boolean(data.completed);

    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  /**
   * Mark a task as done using the dedicated /tasks/{id}/done endpoint
   * @param {number} id
   */
  async markTaskDone(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}/done`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse(res);
  },

  /**
   * Delete a task by ID
   * @param {number} id
   */
  async deleteTask(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse(res);
  },
};
