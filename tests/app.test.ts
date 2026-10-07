import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { prisma } from "../src/lib/prisma";

import app from "../src/app";
import { priorities, type Task } from "../src/types/Task";

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Learn Express",
    description: "Practice Express",
    completed: false,
    priority: "High",
  },
  {
    id: 2,
    title: "Learn testing",
    description: "Practice Vitest",
    completed: true,
    priority: "Medium",
  },
  {
    id: 3,
    title: "Low priority task",
    description: "Low task",
    completed: false,
    priority: "Low",
  },
  {
    id: 4,
    title: "Critical task",
    description: "Critical task",
    completed: false,
    priority: "Critical",
  },
];

beforeEach(async () => {
  await prisma.$executeRaw`
    TRUNCATE TABLE "Task" RESTART IDENTITY CASCADE
  `;

  await prisma.task.createMany({
    data: initialTasks.map(({ id, ...task }) => task),
  });
});

afterEach(async () => {
  await prisma.$executeRaw`
    TRUNCATE TABLE "Task" RESTART IDENTITY CASCADE
  `;
});

describe("GET /", () => {
  it("should return 200 and API status message", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message: "Todo API is running",
    });
  });
});

// GET
describe("GET /tasks", () => {
  it("should return 200 and tasks array", async () => {
    const response = await request(app).get("/tasks");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("tasks");
    expect(response.body.tasks).toBeInstanceOf(Array);
  });

  it("should return 400 for invalid task id", async () => {
    const response = await request(app).get("/tasks/abc");

    expect(response.status).toBe(400);

    expect(response.body).toMatchObject({
      error: "Invalid task id",
    });
  });

  it("should return 404 when task does not exist", async () => {
    const response = await request(app).get("/tasks/999");

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      error: "Task not found",
    });
  });
});

//CREATE 
describe("POST /tasks", () => {
  it("should return 201 and created task", async () => {
    const newTask = {
      "title": "Learn testing",
      "description": "Practice Vitest and Supertest",
      "priority": "High"
    }

    const response = await request(app).post("/tasks").send(newTask);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      task: newTask,
    });
    expect(response.body.task.id).toEqual(expect.any(Number));
    expect(response.body.task.completed).toBe(false);
  });

  it("should return 400 for invalid title", async () => {
    const newTask = {
      "title": "    ",
      "description": "Practice Vitest and Supertest",
      "priority": "High"
    }

    const response = await request(app).post("/tasks").send(newTask);
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: "Invalid request body",
    });
    expect(response.body.details[0]).toMatchObject({
      path: ["title"],
    });
  });

  it("should return 400 for invalid description", async () => {
    const newTask = {
      "title": "Learn testing",
      "description": "   ",
      "priority": "High"
    }

    const response = await request(app).post("/tasks").send(newTask);
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: "Invalid request body",
    });
    expect(response.body.details[0]).toMatchObject({
      path: ["description"],
    });
  });

  it("should return 400 for invalid priority", async () => {
    const newTask = {
      "title": "Learn testing",
      "description": "Practice Vitest and Supertest",
      "priority": "Urgent"
    }

    const response = await request(app).post("/tasks").send(newTask);
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: "Invalid request body",
    });
    expect(response.body.details[0]).toMatchObject({
      path: ["priority"],
    });
  });

  it("should return 400 for invalid body", async () => {
    const newTask = {};

    const response = await request(app).post("/tasks").send(newTask);
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: "Invalid request body",
    });
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["title"],
        }),
        expect.objectContaining({
          path: ["description"],
        }),
        expect.objectContaining({
          path: ["priority"],
        }),
      ])
    );
  })
});

//UPDATE

describe("PATCH /tasks/:id", () => {
  it("should update task title", async () => {
    const updates = {
      "title": "new title"
    };
  
    const response = await request(app).patch("/tasks/1").send(updates);

    expect(response.status).toBe(200);
    expect(response.body.task).toMatchObject({
      id: 1,
      title: updates.title,
      description: "Practice Express",
      completed: false,
      priority: "High"
    });
  });

  it("should update task completed", async () => {
    const updates = {
      "completed": true
    };
  
    const response = await request(app).patch("/tasks/1").send(updates);

    expect(response.status).toBe(200);
    expect(response.body.task.completed).toBe(updates.completed);
  });

  it("should return 400 for invalid id", async () => {
    const updates = {
      "completed": true
    };

    const response = await request(app).patch("/tasks/abc").send(updates);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: "Invalid task id",
    });
  });

  it("should return 404 for task not found", async () => {
    const updates = {
      "completed": true
    };

    const response = await request(app).patch("/tasks/999").send(updates);

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: "Task not found",
    });
  });

  it("should return 400 for body empty", async () => {
    const response = await request(app).patch("/tasks/1").send({});

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: "Invalid request body",
    });
  });

  it("should return 400 for invalid priority", async () => {
    const updates = {
      "priority": "text"
    };
    const response = await request(app).patch("/tasks/1").send(updates);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: "Invalid request body",
    });
    expect(response.body.details[0]).toMatchObject({
      path: ["priority"],
    });
  });
});

//DELETE
describe("DELETE /tasks/:id", () => {
  it("should return 200 and delete task", async () => {
    const response = await request(app).delete("/tasks/1");
  
    expect(response.status).toBe(200);
  
    expect(response.body).toMatchObject({
      task: {
        id: 1,
        title: "Learn Express",
        description: "Practice Express",
        completed: false,
        priority: "High",
      },
    });
  
    const getResponse = await request(app).get("/tasks/1");
  
    expect(getResponse.status).toBe(404);
  
    expect(getResponse.body).toEqual({
      error: "Task not found",
    });
  });

  it("should return 400 for invalid id", async () => {
    const response = await request(app).delete("/tasks/abc");
    
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: "Invalid task id",
    });
  });

  it("should return 404 for task not found", async () => {
   
    const response = await request(app).delete("/tasks/999");

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: "Task not found",
    });
  });
});

//Filtering and Sort

describe("Filtering and sort", () => {
  it("should return only completed tasks", async () => {
    const response = await request(app).get("/tasks?completed=true");
    
    expect(response.status).toBe(200);

    expect(response.body.tasks).toEqual(
      initialTasks.filter(task => task.completed === true)
    );
  });

  it("should return only incomplete tasks", async () => {
    const response = await request(app)
      .get("/tasks?completed=false");
  
    expect(response.status).toBe(200);
  
    expect(response.body.tasks).toEqual(
      initialTasks.filter(task => task.completed === false)
    );
  });

  it.each(priorities)(
    "should return only tasks with %s priority",
    async (priority) => {
      const response = await request(app)
        .get(`/tasks?priority=${priority}`);

      expect(response.status).toBe(200);

      expect(response.body.tasks).toEqual(
        initialTasks.filter(
          task => task.priority === priority
        )
      );
    }
  );

  it("should return 400 for invalid priority", async () => {
    const response = await request(app)
      .get("/tasks?priority=Urgent");
  
    expect(response.status).toBe(400);
  
    expect(response.body).toMatchObject({
      error: "Invalid request query",
    });
  
    expect(response.body.details[0]).toMatchObject({
      path: ["priority"],
    });
  });

  it("should return the tasks in ascending order by id", async () => {
    const response = await request(app).get("/tasks?sort=id");
    
    expect(response.status).toBe(200);

    expect(response.body.tasks).toEqual(
      [...initialTasks].sort((a, b) => a.id - b.id)
    );
  });

  it("should return the tasks in ascending order by priority", async () => {
    const response = await request(app).get("/tasks?sort=priority");
    
    expect(response.status).toBe(200);

    expect(response.body.tasks).toEqual(
      [...initialTasks].sort((a, b) => priorities.indexOf(a.priority) - priorities.indexOf(b.priority))
    );
  });
  
  it("should return 400 for invalid sort value ", async () => {
    const response = await request(app).get("/tasks?sort=title");

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: "Invalid request query",
    });
    
    expect(response.body.details[0]).toMatchObject({
      path: ["sort"],
    });
  })
})