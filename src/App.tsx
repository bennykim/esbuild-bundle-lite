import { useState } from "react";

import Text from "@/components/Text";
import TodoList from "@/components/TodoList";

const App: React.FC = () => {
  const [showTodoList, setShowTodoList] = useState(false);

  return (
    <div>
      <h1>Hello, React with esbuild!</h1>
      <Text title="Welcome to our Todo App" />
      <button onClick={() => setShowTodoList(!showTodoList)}>
        {showTodoList ? "Hide" : "Show"} Todo List
      </button>
      {showTodoList && <TodoList />}
      <img src="/assets/clock.png" alt="Clock" />
    </div>
  );
};

export default App;
