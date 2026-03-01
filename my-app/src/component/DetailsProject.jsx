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
    
    // שדות עדיפות ותאריך
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

    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData("taskId", taskId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, newStatus) => {
        const taskId = e.dataTransfer.getData("taskId");
        const updatedTasks = localTasks.map(task => {
            if (task.taskId.toString() === taskId.toString()) {
                return { ...task, status: newStatus };
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
                ? { 
                    ...t, 
                    title: newTaskTitle, 
                    taskDescription: newTaskDesc,
                    priority: newTaskPriority,
                    dueDate: newTaskDueDate
                  } 
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

        setNewTaskTitle('');
        setNewTaskDesc('');
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

    if (!projectFromStore) {
        return <h2>פרויקט לא נמצא...</h2>;
    }

    return (
        <div style={{ padding: '20px', direction: 'rtl' }}>
            
            <h1>פרטי הפרויקט: {projectFromStore.name}</h1>
            <p>תיאור: {projectFromStore.description}</p>
            <hr />

            {showForm && (
                <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: `2px solid ${content.color}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ color: content.color, width: '300px', textAlign: 'center' }}>
                        {editingTaskId ? `עדכון משימה ב-${targetStatus}` : `הוספת משימה ל-${targetStatus}`}
                    </h3>
                    
                    <div style={{ marginBottom: '15px', width: '300px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', textAlign: 'right', marginBottom: '5px' }}>{content.titleLabel}</label>
                        <input 
                            type="text" 
                            placeholder="הזן כותרת..." 
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px', width: '300px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', textAlign: 'right', marginBottom: '5px' }}>{content.descLabel}</label>
                        <textarea 
                            value={newTaskDesc}
                            onChange={(e) => setNewTaskDesc(e.target.value)}
                            style={{ padding: '8px', width: '100%', height: '60px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                    </div>

                    {/* שדות עדיפות ותאריך - ממורכזים ומיושרים */}
                    <div style={{ marginBottom: '15px', width: '300px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', textAlign: 'right', marginBottom: '5px' }}>עדיפות:</label>
                        <select 
                            value={newTaskPriority} 
                            onChange={(e) => setNewTaskPriority(e.target.value)}
                            style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '20px', width: '300px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', textAlign: 'right', marginBottom: '5px' }}>תאריך יעד:</label>
                        <input 
                            type="date" 
                            value={newTaskDueDate} 
                            onChange={(e) => setNewTaskDueDate(e.target.value)}
                            style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={handleSaveTask} style={{ padding: '10px 20px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                            {editingTaskId ? 'עדכן משימה' : `שמור ב-${targetStatus}`}
                        </button>
                        <button onClick={() => {setShowForm(false); setEditingTaskId(null);}} style={{ padding: '10px 20px', background: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>ביטול</button>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', gap: '10px', direction: 'ltr' }}>
                {['Backlog', 'In Progress', 'In Review', 'Done'].map((status) => (
                    <div 
                        key={status} 
                        onDragOver={handleDragOver} 
                        onDrop={(e) => handleDrop(e, status)} 
                        style={{ background: '#f4f4f4', padding: '10px', width: '23%', minHeight: '400px', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}
                    >
                        <h3 style={{ textAlign: 'center', borderBottom: `2px solid ${status === 'Backlog' ? '#ccc' : status === 'In Progress' ? '#2196f3' : status === 'In Review' ? '#ff6229' : '#4caf50'}` }}>
                            {status}
                        </h3>
                        
                        <p style={{ fontSize: '0.8em', color: '#666', textAlign: 'left' }}>
                            {status === 'Backlog' && "This item hasn't been started"}
                            {status === 'In Progress' && "This is actively being worked on"}
                            {status === 'In Review' && "This item is in review"}
                            {status === 'Done' && "This has been completed"}
                        </p>

                        <div style={{ flexGrow: 1, direction: 'rtl' }}>
                            {localTasks.filter(t => t.status === status).map(task => (
                                <div 
                                    key={task.taskId} 
                                    draggable 
                                    onDragStart={(e) => handleDragStart(e, task.taskId)} 
                                    onClick={() => handleEditClick(task)}
                                    style={{ 
                                        background: 'white', 
                                        margin: '10px 0', 
                                        padding: '12px', 
                                        borderRadius: '5px', 
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
                                        position: 'relative', 
                                        cursor: 'pointer',
                                        minHeight: '60px',
                                        textAlign: 'right'
                                    }}
                                >
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation(); 
                                            handleDeleteLocal(task.taskId);
                                        }}
                                        style={{ position: 'absolute', top: '5px', left: '5px', border: 'none', background: 'none', cursor: 'pointer', color: '#ff4444', fontWeight: 'bold', fontSize: '16px', zIndex: 10 }}
                                    >✕</button>

                                    <h4 style={{ margin: '0 0 5px 0', paddingLeft: '20px' }}>{task.title}</h4>
                                    <p style={{ fontSize: '0.9em', margin: '0', textDecoration: status === 'Done' ? 'line-through' : 'none' }}>
                                        {task.taskDescription}
                                    </p>

                                    <div style={{ marginTop: '10px', fontSize: '0.75em', color: '#555', borderTop: '1px solid #eee', paddingTop: '5px' }}>
                                        <span>🔥 עדיפות: <strong>{task.priority}</strong></span>
                                        <br />
                                        <span>📅 יעד: {task.dueDate || 'לא הוגדר'}</span>
                                    </div>

                                    <div style={{ textAlign: 'right', marginTop: '5px' }}>
                                        <small style={{ fontSize: '0.7em', color: '#999' }}>לחץ לעריכה 📝</small>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => openForm(status)} style={{ marginTop: '10px', padding: '5px', cursor: 'pointer', border: 'none', background: 'none', textAlign: 'left', color: '#0078d4' }}>
                            + Add item
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DetailsProject;