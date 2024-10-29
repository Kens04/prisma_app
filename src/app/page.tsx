import { revalidatePath } from "next/cache";

const getTodoList = async () => {
  const res = await fetch("http://localhost:3000/api/todo");
  const json = await res.json();
  return json.todos;
};

type todo = {
  id: number;
  title: string;
  created_at: Date;
};

export default async function Home() {
  const todoList = await getTodoList();

  //server actionsを利用してTODOを追加
  const addPost = async (formData: FormData) => {
    "use server";
    const text: FormDataEntryValue | null = formData.get("text");
    if (!text) return;

    const res = await fetch("http://localhost:3000/api/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: text,
      }),
    });
    revalidatePath("/");
  };

  //server actionsを利用してTODOを削除
  const deletePost = async (formData: FormData) => {
    "use server";
    const id: FormDataEntryValue | null = formData.get("id");
    if (!id) return;
    await fetch(`http://localhost:3000/api/todo/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    });
    revalidatePath("/");
  };

  return (
    <main>
      <h1>Next.js + TypeScript + Prisma + supabase</h1>
      <form action={addPost}>
        <input type="text" name="text" placeholder="New task..." />
        <button>Add Task</button>
      </form>
      <ul className="space-y-4">
        {todoList.map((todo: todo) => (
          <li key={todo.id}>
            <span>{todo.title}</span>
            <form>
              <input type="hidden" name="id" value={todo.id} />
              <button formAction={deletePost}>削除</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
