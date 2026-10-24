from fastapi import FastAPI, HTTPException
# pyrefly: ignore[missing-import]
from app.schemas import TaskCreate, TaskUpdate
# pyrefly: ignore[missing-import]
from app.db import supabase

app=FastAPI()

@app.get("/")
def home():
    return {"message": "FastAPI + Supabase is running"}

@app.post("/tasks", status_code=201)
def create_task(task: TaskCreate):
    result = (
        supabase.table("tasks")
        .insert(task.model_dump())
        .execute()
    )
    return result.data[0]

@app.get("/tasks")
def get_tasks():
    result=(
        supabase.table("tasks")
        .select("*")
        .order("id", desc=True)
        .execute()
    )
    return result.data

@app.get("/tasks/{id}")
def get_task_by_id(id: int):
    result=(
        supabase.table("tasks")
        .select("*")
        .eq("id", id)
        .limit(1)
        .execute()
    )

    if not result.data:
        return {"message": "Task not found"}
    
    return result.data[0]

@app.patch("/tasks/{id}")
def update_task(task: TaskUpdate, id: int):
    changes= task.model_dump(exclude_unset= True)

    if not changes:
        raise HTTPException(
            status_code=400,
            detail= "No field provided"
        )
    result=(
        supabase.table("tasks")
        .update(changes)
        .eq("id", id)
        .execute()
    )
    if not result.data:
        raise HTTPException(
            status_code=404,
            detail= "Task not found"
        )
    
    return result.data[0]

@app.delete("/tasks/{id}")
def delete_task(id: int):
    result=(
        supabase.table("tasks")
        .delete()
        .eq("id", id)
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )
    
    return {"message": "Task deleted successfully"}

@app.patch("/tasks/{id}/done")
def task_done(id: int):
    result=(
        supabase.table("tasks")
        .update({"completed": True})
        .eq("id", id)
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=404,
            detail= "Task not found"
        )
    
    return result.data[0]


# app=FastAPI()
# text_posts={
#     0: {"title": "first content", "content": "first post"},
#     1: {"title": "second content", "content": "second post"},
#     2: {"title": "third content", "content": "third post"}, 
#     3: {"title": "fourth content", "content": "fourth post"},
#     4: {"title": "fifth content", "content": "fifth post"}
# }

# @app.get("/")
# def hello():
#     return {"name": "hello"}

# @app.get("/posts")
# def get_posts():
#     return text_posts

# @app.get("/posts/{id}")
# def get_post_by_id(id: int):
#     if id in text_posts.keys():
#         return text_posts[id]
#     return "post not found"

# @app.post("/posts")
# def create_post(post: PostCreate):
#     text_posts[max(text_posts.keys()) + 1] ={"title": post.title, "content": post.content}
#     return post 