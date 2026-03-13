import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../store/userSlice"; 
import { useForm } from "react-hook-form"; 
import { TextField, Button, Box, Typography, Container } from "@mui/material";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm(); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // הפונקציה שתופעל רק אם הטופס תקין
  const onSubmit = (data) => {
    // שמירת נתוני המשתמש ב-Redux Toolkit
    dispatch(login({ userName: data.userName, email: data.email })); 
    // מעבר למסך רשימת הפרויקטים כנדרש 
    navigate("/ProjectsList"); 
  };

  return (
    <Container maxWidth="xs">
      <Box 
        sx={{ 
          marginTop: 8, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 2 
        }}
      >
        <Typography component="h1" variant="h5">
          כניסה למערכת ניהול פרויקטים 
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          {/* שדה שם משתמש עם MUI ו-react-hook-form  */}
          <TextField
            margin="normal"
            fullWidth
            label="שם משתמש"
            {...register("userName", { required: "חובה להזין שם משתמש" })}
            error={!!errors.userName}
            helperText={errors.userName?.message}
          />

          {/* שדה אימייל עם ולידציה  */}
          <TextField
            margin="normal"
            fullWidth
            label="אימייל"
            {...register("email", { 
              required: "חובה להזין אימייל",
              pattern: { 
                value: /^\S+@\S+$/i, 
                message: "אימייל לא תקין" 
              }
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            כניסה ושמירה 
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;