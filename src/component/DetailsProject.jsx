import '../App.css';
import React, { useState, useEffect } from 'react'; 
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addTask } from '../store/projectsSlice'; 

const DetailsProject = () => {
    
    const { projectId } = useParams();
    const dispatch = useDispatch();

    const [showForm, setShowForm] = useState(false);
    const [targetStatus, setTargetStatus] = useState('Backlog');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    
    const [newTaskPriority, setNewTaskPriority] = useState('Medium');
    const [newTaskDueDate, setNewTaskDueDate] = useState('');

    const [editingTaskId, setEditingTaskId] = useState(null);

    const projectFromStore = useSelector((state) =>
        state.projects.projects.find((p) => p.id === Number(projectId))
    );

    const [localTasks, setLocalTasks] = useState([]);

    useEffect(() => {
        if (projectFromStore) {
            setLocalTasks(projectFromStore.tasks);
        }
    }, [projectFromStore]);

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

    const handleDeleteLocal = (taskId) => {
        if (window.confirm("האם את בטוחה שברצונך למחוק משימה זו?")) {
            const updatedTasks = localTasks.filter(t => t.taskId !== taskId);
            setLocalTasks(updatedTasks);
        }
    };

    const handleEditClick = (task) => {
        setEditingTaskId(task.taskId);
        setTargetStatus(task.status);
        setNewTaskTitle(task.title);
        setNewTaskDesc(task.taskDescription);
        setNewTaskPriority(task.priority || 'Medium');
        setNewTaskDueDate(task.dueDate || '');
        setShowForm(true);
    };

    const openForm = (status) => {
        setEditingTaskId(null);
        setTargetStatus(status);
        setNewTaskTitle('');
        setNewTaskDesc('');
        setNewTaskPriority('Medium');
        setNewTaskDueDate('');
        setShowForm(true);
    };

    const handleSaveTask = () => {
        if (newTaskTitle.trim() === '') return;

        if (editingTaskId) {
            const updatedTasks = localTasks.map(t => 
                t.taskId === editingTaskId 
                ? { ...t, title: newTaskTitle, taskDescription: newTaskDesc, priority: newTaskPriority, dueDate: newTaskDueDate } 
                : t
            );
            setLocalTasks(updatedTasks);
        } else {
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

    if (!projectFromStore) return <h2>פרויקט לא נמצא...</h2>;

    return (
        <div style={{ padding: '20px', direction: 'rtl' }}>
            <h1>שם הפרויקט: {projectFromStore.name}</h1>
            <p>תיאור: {projectFromStore.description}</p>
            <hr />

            {showForm && (
                <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: `2px solid ${content.color}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ color: content.color }}>{editingTaskId ? `עדכון משימה ב-${targetStatus}` : `הוספת משימה ל-${targetStatus}`}</h3>
                    <div style={{ marginBottom: '15px', width: '300px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', textAlign: 'right' }}>{content.titleLabel}</label>
                        <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </div>
                    <div style={{ marginBottom: '15px', width: '300px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', textAlign: 'right' }}>{content.descLabel}</label>
                        <textarea value={newTaskDesc} onChange={(e) => setNewTaskDesc(e.target.value)} style={{ width: '100%', height: '60px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </div>
                    <div style={{ marginBottom: '15px', width: '300px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', textAlign: 'right' }}>עדיפות:</label>
                        <select value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '20px', width: '300px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', textAlign: 'right' }}>תאריך יעד:</label>
                        <input type="date" value={newTaskDueDate} onChange={(e) => setNewTaskDueDate(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={handleSaveTask} style={{ padding: '10px 20px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>שמור</button>
                        <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>ביטול</button>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', gap: '10px', direction: 'ltr' }}>
                {['Backlog', 'In Progress', 'In Review', 'Done'].map((status) => (
                    <div key={status} style={{ background: '#f4f4f4', padding: '10px', width: '23%', minHeight: '400px', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ textAlign: 'center', borderBottom: `2px solid ${status === 'Backlog' ? '#ccc' : status === 'In Progress' ? '#2196f3' : status === 'In Review' ? '#ff6229' : '#4caf50'}` }}>{status}</h3>
                        <p style={{ fontSize: '0.8em', color: '#666', textAlign: 'left' }}>{status === 'Backlog' ? "Haven't started" : status === 'In Progress' ? "Actively working" : status === 'In Review' ? "In review" : "Completed"}</p>
                        
                        <div style={{ flexGrow: 1, direction: 'rtl' }}>
                            {localTasks.filter(t => t.status === status).map(task => (
                                <div key={task.taskId} style={{ background: 'white', margin: '10px 0', padding: '12px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative', textAlign: 'right' }}>
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteLocal(task.taskId); }} style={{ position: 'absolute', top: '5px', left: '5px', border: 'none', background: 'none', cursor: 'pointer', color: '#ff4444', fontWeight: 'bold' }}>✕</button>
                                    <div onClick={() => handleEditClick(task)} style={{ cursor: 'pointer' }}>
                                        <h4 style={{ margin: '0 0 5px 0' }}>{task.title}</h4>
                                        <p style={{ fontSize: '0.9em', margin: '0', textDecoration: status === 'Done' ? 'line-through' : 'none' }}>{task.taskDescription}</p>
                                        <div style={{ marginTop: '10px', fontSize: '0.75em', color: '#555', borderTop: '1px solid #eee', paddingTop: '5px' }}>
                                            <span>🔥 עדיפות: <strong>{task.priority}</strong></span><br />
                                            <span>📅 יעד: {task.dueDate || 'לא הוגדר'}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', direction: 'ltr' }}>
                                        {/* חץ ימינה -> מחזיר אחורה */}
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); moveTask(task.taskId, -1); }} 
                                            disabled={status === 'Backlog'}
                                            style={{ cursor: status === 'Backlog' ? 'default' : 'pointer', opacity: status === 'Backlog' ? 0.3 : 1, border: '1px solid #ccc', borderRadius: '4px', background: '#fff', padding: '2px 8px' }}
                                        >
                                            ←
                                        </button>
                                        
                                        <small style={{ fontSize: '0.7em', color: '#999' }}>עריכה 📝</small>
                                        
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); moveTask(task.taskId, 1); }} 
                                            disabled={status === 'Done'}
                                            style={{ cursor: status === 'Done' ? 'default' : 'pointer', opacity: status === 'Done' ? 0.3 : 1, border: '1px solid #ccc', borderRadius: '4px', background: '#fff', padding: '2px 8px' }}
                                        >
                                           →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => openForm(status)} style={{ marginTop: '10px', color: '#0078d4', background: 'none', border: 'none', cursor: 'pointer' }}>+ Add item</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DetailsProject;