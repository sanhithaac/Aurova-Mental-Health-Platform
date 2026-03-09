import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';

const doctors = [
  { id: 'doc1', name: 'Dr. A. Sharma', specialty: 'Psychiatrist' },
  { id: 'doc2', name: 'Dr. B. Patel', specialty: 'Clinical Psychologist' },
  { id: 'doc3', name: 'Dr. C. Singh', specialty: 'Therapist' },
];

const columns: GridColDef[] = [
  { field: 'bookingId', headerName: 'Booking ID', width: 120 },
  { field: 'patientName', headerName: 'Patient Name', width: 150 },
  { field: 'doctorId', headerName: 'Doctor', width: 180, valueGetter: (value: string) => doctors.find(d => d.id === value)?.name || value },
  { field: 'date', headerName: 'Date', width: 120 },
  { field: 'time', headerName: 'Time', width: 100 },
  { field: 'sessionType', headerName: 'Session Type', width: 120 },
  { field: 'reason', headerName: 'Reason', width: 180 },
  { field: 'status', headerName: 'Status', width: 120 },
];

interface BookingEntry {
  bookingId: string;
  patientName: string;
  doctorId: string;
  date: string;
  time: string;
  sessionType: string;
  reason: string;
  status: string;
  notes?: string;
}

export default function PatientForm() {
  const [bookings, setBookings] = useState<BookingEntry[]>([]);
  const [form, setForm] = useState<BookingEntry>({
    bookingId: '',
    patientName: '',
    doctorId: '',
    date: '',
    time: '',
    sessionType: '',
    reason: '',
    status: 'Pending',
  });
  const [searchBookingId, setSearchBookingId] = useState('');
  const [searchPatientName, setSearchPatientName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDialogOpen = (type: string, id: string | null = null) => {
    setDialogType(type);
    setDialogOpen(true);
    setSelectedId(id);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogType('');
    setSelectedId(null);
  };

  const handleInsert = () => {
    setForm({
      bookingId: Date.now().toString(),
      patientName: '',
      doctorId: '',
      date: '',
      time: '',
      sessionType: '',
      reason: '',
      status: 'Pending',
    });
    handleDialogOpen('insert');
  };

  const handleDelete = (id: string) => {
    handleDialogOpen('delete', id);
  };

  const handleUpdate = (id: string) => {
    const booking = bookings.find((b) => b.bookingId === id);
    if (booking) setForm({ ...booking });
    handleDialogOpen('update', id);
  };

  const handleDialogOK = () => {
    if (dialogType === 'insert') {
      setBookings([...bookings, { ...form }]);
    } else if (dialogType === 'delete') {
      setBookings(bookings.filter((b) => b.bookingId !== selectedId));
    } else if (dialogType === 'update') {
      setBookings(
        bookings.map((b) => (b.bookingId === selectedId ? { ...form } : b))
      );
    }
    handleDialogClose();
  };

  const handleSearch = () => {
    let filtered = bookings;
    if (searchBookingId) {
      filtered = filtered.filter((b) => b.bookingId === searchBookingId);
    }
    if (searchPatientName) {
      filtered = filtered.filter((b) => b.patientName.toLowerCase().includes(searchPatientName.toLowerCase()));
    }
    return filtered;
  };

  const displayedBookings = handleSearch();

  return (
    <div className="bg-white dark:bg-card-dark p-6 rounded-xl shadow-retro max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-primary">Book a Doctor Consultation</h2>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Search by Booking ID"
            value={searchBookingId}
            onChange={(e) => setSearchBookingId(e.target.value)}
            variant="outlined"
            size="small"
            className="mb-4"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Search by Patient Name"
            value={searchPatientName}
            onChange={(e) => setSearchPatientName(e.target.value)}
            variant="outlined"
            size="small"
            className="mb-4"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button variant="contained" color="primary" onClick={handleInsert}>
            New Booking
          </Button>
        </Grid>
      </Grid>
      <div style={{ height: 400, width: '100%', marginTop: 16 }}>
        <DataGrid
          rows={displayedBookings}
          columns={[
            ...columns,
            {
              field: 'actions',
              headerName: 'Actions',
              width: 180,
              renderCell: (params) => (
                <>
                  <Button variant="outlined" color="primary" size="small" style={{ marginRight: 8 }} onClick={() => handleUpdate(params.row.bookingId)}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(params.row.bookingId)}>
                    Delete
                  </Button>
                </>
              ),
            },
          ]}
          pageSizeOptions={[5, 10]}
          pagination
          getRowId={(row) => row.bookingId}
        />
      </div>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {dialogType === 'insert' && 'Book Consultation'}
          {dialogType === 'delete' && 'Delete Booking'}
          {dialogType === 'update' && 'Update Booking'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'delete' ? (
            <DialogContentText>
              <span className="font-bold text-red-600">Warning:</span> This action will permanently delete booking <b>{selectedId}</b>.<br />
              Are you sure you want to proceed?
            </DialogContentText>
          ) : (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Patient Name"
                  name="patientName"
                  value={form.patientName}
                  onChange={handleChange}
                  fullWidth
                  required
                  helperText="Enter the patient's full name"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Doctor"
                  name="doctorId"
                  value={form.doctorId}
                  onChange={handleChange}
                  select
                  fullWidth
                  required
                  helperText="Select a doctor for consultation"
                >
                  {doctors.map((doc) => (
                    <MenuItem key={doc.id} value={doc.id}>{doc.name} ({doc.specialty})</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                  helperText="Select appointment date"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                  helperText="Select appointment time"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Session Type"
                  name="sessionType"
                  value={form.sessionType}
                  onChange={handleChange}
                  select
                  fullWidth
                  required
                  helperText="Choose session type"
                >
                  <MenuItem value="Video">Video</MenuItem>
                  <MenuItem value="Voice">Voice</MenuItem>
                  <MenuItem value="Chat">Chat</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Reason for Visit"
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  fullWidth
                  required
                  multiline
                  minRows={2}
                  helperText="Describe the reason for consultation"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  select
                  fullWidth
                  required
                  helperText="Set booking status"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Confirmed">Confirmed</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Notes (optional)"
                  name="notes"
                  value={form.notes || ''}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  minRows={2}
                  helperText="Add any extra notes or instructions"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary" variant="outlined">
            Cancel
          </Button>
          {dialogType === 'delete' ? (
            <Button onClick={handleDialogOK} color="error" variant="contained">
              Delete
            </Button>
          ) : dialogType === 'update' ? (
            <Button onClick={handleDialogOK} color="primary" variant="contained">
              Update
            </Button>
          ) : (
            <Button onClick={handleDialogOK} color="primary" variant="contained">
              Insert
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
