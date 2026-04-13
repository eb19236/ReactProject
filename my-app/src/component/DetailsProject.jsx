import '../App.css';
import React, { useState, useEffect } from 'react'; 
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addTask } from '../store/projectsSlice'; 


 //DetailsProject - קומפוננטת לוח ניהול משימות (Kanban)
//מאפשרת צפייה בפרטי פרויקט וניהול משימות לפי סטטוסים.
 
const DetailsProject = () => {
    // --- שליפת נתונים וכלים ---
    const { projectId } = useParams(); // מזהה הפרויקט מה-URL
    const dispatch = useDispatch();

    // --- ניהול סטייט מקומי לטפסים ---
    const [showForm, setShowForm] = useState(false);        // האם להציג את טופס הוספה/עריכה
    const [targetStatus, setTargetStatus] = useState('Backlog'); // לאיזה עמודה המשימה שייכת
    const [newTaskTitle, setNewTaskTitle] = useState('');    // כותרת המשימה
    const [newTaskDesc, setNewTaskDesc] = useState('');      // תיאור המשימה
    const [newTaskPriority, setNewTaskPriority] = useState('Medium'); // עדיפות
    const [newTaskDueDate, setNewTaskDueDate] = useState(''); // תאריך יעד
    const [editingTaskId, setEditingTaskId] = useState(null); // מזהה משימה בעריכה

    // --- שליפת הפרויקט מה-Store הגלובלי ---
    const projectFromStore = useSelector((state) =>
        state.projects.projects.find((p) => p.id === Number(projectId))
    );

    // סטייט מקומי למשימות (מאפשר שינויים מהירים בדף לפני סנכרון סופי)
    const [localTasks, setLocalTasks] = useState([]);

    // סנכרון המשימות המקומיות כשהפרויקט נטען מה-Store
    useEffect(() => {
        if (projectFromStore) {
            setLocalTasks(projectFromStore.tasks);
        }
    }, [projectFromStore]);

    /**
     * פונקציה להזזת משימה בין שלבים
     * @param {number} taskId - מזהה המשימה
     * @param {number} direction התנועה (1 קדימה, -1 אחורה)
     */
    const moveTask = (taskId, direction) => {
        const statuses = ['Backlog', 'In Progress', 'In Review', 'Done'];
        const updatedTasks = localTasks.map(task => {
            if (task.taskId === taskId) {
                const currentIndex = statuses.indexOf(task.status);
                const nextIndex = currentIndex + direction;
                
                if (nextIndex >= 0 && nextIndex < statuses.length) {
                    return { ...task, status: statuses[nextIndex] };
                }
            }
            return task;
        });
        setLocalTasks(updatedTasks);
    };

    
    //מחיקת משימה מהתצוגה המקומית
     
    const handleDeleteLocal = (taskId) => {
        if (window.confirm("האם את בטוחה שברצונך למחוק משימה זו?")) {
            const updatedTasks = localTasks.filter(t => t.taskId !== taskId);
            setLocalTasks(updatedTasks);
        }
    };

    
    //  טעינת נתוני משימה קיימת לתוך הטופס לצורך עריכה
     
    const handleEditClick = (task) => {
        setEditingTaskId(task.taskId);
        setTargetStatus(task.status);
        setNewTaskTitle(task.title);
        setNewTaskDesc(task.taskDescription);
        setNewTaskPriority(task.priority || 'Medium');
        setNewTaskDueDate(task.dueDate || '');
        setShowForm(true);
    };

    
     //פתיחת טופס ריק להוספת משימה חדשה בסטטוס מסוים
     
    const openForm = (status) => {
        setEditingTaskId(null);
        setTargetStatus(status);
        setNewTaskTitle('');
        setNewTaskDesc('');
        setNewTaskPriority('Medium');
        setNewTaskDueDate('');
        setShowForm(true);
    };

    
    // שמירת המשימה - אם מדובר בעריכה מעדכן מקומית, אם חדשה שולח ל-Redux
     
    const handleSaveTask = () => {
        if (newTaskTitle.trim() === '') return;

        if (editingTaskId) {
            // עדכון משימה קיימת במערך המקומי
            const updatedTasks = localTasks.map(t => 
                t.taskId === editingTaskId 
                ? { ...t, title: newTaskTitle, taskDescription: newTaskDesc, priority: newTaskPriority, dueDate: newTaskDueDate } 
                : t
            );
            setLocalTasks(updatedTasks);
        } else {
            // יצירת משימה חדשה ושליחה ל-Store
            const newTask = {
                taskId: Date.now(),
                title: newTaskTitle,
                taskDescription: newTaskDesc,
                status: targetStatus, 
                priority: newTaskPriority,
                dueDate: newTaskDueDate
            };
            dispatch(addTask({ projectId: Number(projectId), task: newTask }));
        }
        setShowForm(false);
        setEditingTaskId(null);
    };

   
   // פונקציית עזר לניהול טקסטים וצבעים דינמיים בטופס לפי הסטטוס
     
    const getFormContent = () => {
        const isEdit = editingTaskId !== null;
        switch(targetStatus) {
            case 'Backlog': return { titleLabel: isEdit ? "ערוך רעיון:" : "שם המשימה החדשה:", descLabel: "פרטי הרעיון:", color: "#ccc" };
            case 'In Progress': return { titleLabel: isEdit ? "ערוך ביצוע:" : "מה בביצוע כרגע?", descLabel: "סטטוס עבודה:", color: "#2196f3" };
            case 'In Review': return { titleLabel: isEdit ? "ערוך בדיקה:" : "מה מוכן לבדיקה?", descLabel: "הערות לבודק (QA):", color: "#ff6229" };
            case 'Done': return { titleLabel: isEdit ? "ערוך סיכום:" : "סיכום משימה שבוצעה:", descLabel: "תוצאה סופית:", color: "#4caf50" };
            default: return { titleLabel: "כותרת:", descLabel: "תיאור:", color: "#ccc" };
        }
    };

    const content = getFormContent();

    // הגנה במקרה שהפרויקט לא נמצא במערכת
    if (!projectFromStore) return <h2>פרויקט לא נמצא...</h2>;

    return (
        <div style={{ padding: '20px', direction: 'rtl' }}>
            {/* כותרת הפרויקט */}
            <h1>שם הפרויקט: {projectFromStore.name}</h1>
            <p>תיאור: {projectFromStore.description}</p>
            <hr />

            {/* טופס הוספה/עריכה דף */}
            {showForm && (
                <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: `2px solid ${content.color}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ color: content.color }}>{editingTaskId ? `עדכון משימה ב-${targetStatus}` : `הוספת משימה ל-${targetStatus}`}</h3>
                    
                    <div style={{ marginBottom: '15px', width: '300px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>{content.titleLabel}</label>
                        <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                    </div>

                    <div style={{ marginBottom: '15px', width: '300px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>{content.descLabel}</label>
                        <textarea value={newTaskDesc} onChange={(e) => setNewTaskDesc(e.target.value)} style={{ width: '100%', height: '60px' }} />
                    </div>

                    <div style={{ marginBottom: '15px', width: '300px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>עדיפות:</label>
                        <select value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value)} style={{ width: '100%', padding: '8px' }}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '20px', width: '300px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>תאריך יעד:</label>
                        <input type="date" value={newTaskDueDate} onChange={(e) => setNewTaskDueDate(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={handleSaveTask} style={{ padding: '10px 20px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>שמור</button>
                        <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>ביטול</button>
                    </div>
                </div>
            )}

            {/* לוח המשימות בתצוגת עמודות */}
            <div style={{ display: 'flex', justifyContent: 'space-around', gap: '10px', direction: 'ltr' }}>
                {['Backlog', 'In Progress', 'In Review', 'Done'].map((status) => (
                    <div key={status} style={{ background: '#f4f4f4', padding: '10px', width: '23%', minHeight: '400px', borderRadius: '8px' }}>
                        <h3 style={{ textAlign: 'center', borderBottom: `2px solid ${status === 'Backlog' ? '#ccc' : status === 'In Progress' ? '#2196f3' : status === 'In Review' ? '#ff6229' : '#4caf50'}` }}>
                            {status}
                        </h3>
                        
                        <div style={{ flexGrow: 1, direction: 'rtl' }}>
                            {localTasks.filter(t => t.status === status).map(task => (
                                <div key={task.taskId} style={{ background: 'white', margin: '10px 0', padding: '12px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative' }}>
                                    {/* כפתור מחיקה */}
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteLocal(task.taskId); }} style={{ position: 'absolute', top: '5px', left: '5px', color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                                    
                                    {/* תוכן המשימה - לחיצה עליו פותחת עריכה */}
                                    <div onClick={() => handleEditClick(task)} style={{ cursor: 'pointer' }}>
                                        <h4 style={{ margin: '0 0 5px 0' }}>{task.title}</h4>
                                        <p style={{ fontSize: '0.9em', textDecoration: status === 'Done' ? 'line-through' : 'none' }}>{task.taskDescription}</p>
                                        <div style={{ marginTop: '10px', fontSize: '0.75em', color: '#555' }}>
                                            <span>🔥 עדיפות: {task.priority}</span><br />
                                            <span>📅 יעד: {task.dueDate || 'לא הוגדר'}</span>
                                        </div>
                                    </div>

                                    {/* כפתורי הזזה בין עמודות */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', direction: 'ltr' }}>
                                        <button onClick={() => moveTask(task.taskId, -1)} disabled={status === 'Backlog'} style={{ cursor: 'pointer' }}>←</button>
                                        <small style={{ color: '#999' }}>עריכה 📝</small>
                                        <button onClick={() => moveTask(task.taskId, 1)} disabled={status === 'Done'} style={{ cursor: 'pointer' }}>→</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* כפתור הוספת פריט חדש לעמודה */}
                        <button onClick={() => openForm(status)} style={{ marginTop: '10px', color: '#0078d4', background: 'none', border: 'none', cursor: 'pointer' }}>+ Add item</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DetailsProject;