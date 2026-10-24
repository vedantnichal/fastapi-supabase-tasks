from pydantic import BaseModel, Field

class PostCreate(BaseModel):
    title: str
    content: str

class TaskCreate(BaseModel):
    title: str= Field(min_length=1, max_length=1000)
    description: str | None=None

class TaskUpdate(BaseModel):
    title: str | None = Field(
        default=None, min_length=1, max_length=200
    )
    description: str | None = None
    completed: bool | None = None