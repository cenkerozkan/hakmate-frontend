import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Snackbar,
  Alert,
  CssBaseline,
} from '@mui/material';
import { styled } from '@mui/system';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import emailjs from 'emailjs-com';
import AppTheme from '../shared-theme/AppTheme';
import AppAppBar from '../components/AppAppBar';
import { AuthAPI } from '../api/api';

const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
  width: '100%',
  fontSize: theme.typography.body1.fontSize,
  fontFamily: theme.typography.fontFamily,
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '&:focus': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
  },
  background: 'none',
  resize: 'none',
}));

const ContactPage = (props) => {
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    subject: '',
    message: '',
  });

  const [disabledFields, setDisabledFields] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    AuthAPI.getMe()
      .then((res) => {
        const { name, surname, email } = res.data.user.user_metadata;
        setForm((prev) => ({
          ...prev,
          name,
          surname,
          email,
        }));
        setDisabledFields(true);
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timestamp = new Date().toLocaleString('tr-TR');

    try {
      await emailjs.send(
        'service_lxohqz4',
        'template_hb1o0li',
        {
          from_name: `${form.name} ${form.surname}`,
          reply_to: form.email,
          subject: form.subject,
          message: form.message,
          timestamp,
        },
        'cZh9L_nQT2wJkc50y'
      );

      setSnackbar({ open: true, message: 'Mesajınız başarıyla gönderildi.', severity: 'success' });
      setForm((prev) => ({ ...prev, subject: '', message: '' }));
    } catch (error) {
      setSnackbar({ open: true, message: 'Gönderim sırasında bir hata oluştu.', severity: 'error' });
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Container maxWidth="sm" sx={{ mt: 16, mb: 8 }}>
        <Typography variant="h4" gutterBottom>
          İletişim
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            mt: 3,
          }}
        >
          <TextField
            label="İsim"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={disabledFields}
            required
            fullWidth
          />
          <TextField
            label="Soyisim"
            name="surname"
            value={form.surname}
            onChange={handleChange}
            disabled={disabledFields}
            required
            fullWidth
          />
          <TextField
            label="E-posta"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            disabled={disabledFields}
            required
            fullWidth
          />
          <TextField
            label="Konu Başlığı"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
            fullWidth
          />

          <StyledTextarea
            placeholder="Mesajınız"
            name="message"
            value={form.message}
            onChange={handleChange}
            minRows={5}
            required
          />

          <Button type="submit" variant="contained" size="large">
            Gönder
          </Button>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </AppTheme>
  );
};

export default ContactPage;
