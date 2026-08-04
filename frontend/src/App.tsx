import { Route, Routes } from 'react-router-dom';

import { TasksPage } from '@/pages/TasksPage';
import { TodoDetailPage } from '@/pages/TodoDetailPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<TasksPage />} />
            <Route path="/todos/:id" element={<TodoDetailPage />} />
        </Routes>
    );
}

export default App;
