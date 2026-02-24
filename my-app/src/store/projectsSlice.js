import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projects: [
    {
      id: 1,
      name: "פרויקט לדוגמה",
      description: "זהו פרויקט ראשון שנוצר כדי לבדוק שהמערכת עובדת",
      createdDate: "2024-03-20",
      tasks: [
        {
          taskId: 101,
          title: "משימה בבדיקה",
          taskDescription: "צריך לבדוק שהעיצוב נראה טוב",
          status: "In Review", // סטטוס מוכן לבדיקות 
          priority: "High"
        },
        {
          taskId: 102,
          title: "משימה שהסתיימה",
          taskDescription: "בניית עמוד ה-Login",
          status: "Done", // סטטוס משימות שבוצעו 
          priority: "Medium"
        }
      ]
    }
  ]
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // הוספת פרויקט חדש 
    addProject: (state, action) => {
      // הפרויקט יכיל שם, תיאור ותאריך יצירה 
      state.projects.push({
        ...action.payload,
        tasks: [] // פרויקט חדש נוצר עם רשימת משימות ריקה
      });
    },
    // עריכת פרויקט קיים 
    updateProject: (state, action) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = { ...state.projects[index], ...action.payload };
      }
    },
    // מחיקת פרויקט 
    deleteProject: (state, action) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
    },
    // הוספת משימה לפרויקט ספציפי 
    addTask: (state, action) => {
      const { projectId, task } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      if (project) {
        project.tasks.push(task);
      }
    },
    // שינוי סטטוס משימה 
    updateTaskStatus: (state, action) => {
      const { projectId, taskId, newStatus } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      if (project) {
        const task = project.tasks.find(t => t.taskId === taskId);
        if (task) {
          task.status = newStatus;
        }
      }
    }
  }
});

// ייצוא הפעולות לשימוש בקומפוננטות 
export const { 
  addProject, 
  updateProject, 
  deleteProject, 
  addTask, 
  updateTaskStatus 
} = projectsSlice.actions;

export default projectsSlice.reducer;