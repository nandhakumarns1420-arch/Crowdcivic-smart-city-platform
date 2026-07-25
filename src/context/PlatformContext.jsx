import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const PlatformContext = createContext();

export const usePlatform = () => useContext(PlatformContext);

export const PlatformProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Fetch complaints from API
  const fetchComplaints = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const res = await api.get('/complaints');
      if (res.data.success) {
        setComplaints(res.data.data);
      }
    } catch (err) {
      console.error("[CONTEXT] Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch analytics from API
  const fetchAnalytics = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const res = await api.get('/complaints/analytics');
      if (res.data.success) {
        setAnalytics(res.data.data);
      }
    } catch (err) {
      console.error("[CONTEXT] Error fetching analytics:", err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let isMounted = true;
    
    const load = async () => {
      if (isMounted) {
        await fetchComplaints();
        await fetchAnalytics();
      }
    };
    
    load();
    
    return () => { isMounted = false; };
  }, [fetchComplaints, fetchAnalytics]);

  // Toast Notification System
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Complaint Actions
  const submitComplaint = async (formData) => {
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image' && typeof formData[key] === 'string' && formData[key].startsWith('data:')) {
          // Convert base64 to file if needed, but easier to handle in backend or send as is
          // For now, let's assume the backend can handle the base64 or we convert it here
          // Re-fetching the file object from the base64 string
          const byteString = atob(formData[key].split(',')[1]);
          const mimeString = formData[key].split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], {type: mimeString});
          data.append('image', blob, 'complaint.jpg');
        } else if (key === 'location') {
          // Flatten location if it's an object or just use as string
          data.append('location[address]', formData[key]);
        } else {
          data.append(key, formData[key]);
        }
      });
      
      // Add coordinates if available
      const lat = formData.lat || formData.latitude;
      const lng = formData.lng || formData.longitude;
      
      if (lat && lng) {
        data.append('location[latitude]', lat);
        data.append('location[longitude]', lng);
      }

      const res = await api.post('/complaints', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        const complaint = res.data.data;
        // Transform backend response to match frontend expectations if necessary
        const transformed = {
          ...complaint,
          id: complaint.trackingId, // Map trackingId to id for UI compatibility
          date: new Date(complaint.createdAt).toISOString().split('T')[0]
        };
        setComplaints(prev => [transformed, ...prev]);
        fetchAnalytics(); // Update stats
        addToast(`Complaint submitted! Token: ${transformed.id}`, 'success');
        return transformed;
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit complaint', 'error');
      throw err;
    }
  };

  const updateComplaintStatus = async (id, newStatus, metadata = {}) => {
    try {
      // Find the Mongo _id first
      const complaint = complaints.find(c => c.trackingId === id || c.id === id || c._id === id);
      if (!complaint) throw new Error("Complaint not found");
      
      const mongoId = complaint._id;

      let res;
      if (metadata.afterImage) {
        const data = new FormData();
        data.append('status', newStatus);
        data.append('message', metadata.text || `Status updated to ${newStatus}.`);
        data.append('resolutionNotes', metadata.resolutionNotes || '');
        
        // Handle afterImage if it's base64
        if (typeof metadata.afterImage === 'string' && metadata.afterImage.startsWith('data:')) {
          const byteString = atob(metadata.afterImage.split(',')[1]);
          const mimeString = metadata.afterImage.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], {type: mimeString});
          data.append('afterImage', blob, 'resolved.jpg');
        }

        res = await api.put(`/complaints/${mongoId}/status`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await api.put(`/complaints/${mongoId}/status`, {
          status: newStatus,
          message: metadata.text || `Status updated to ${newStatus}.`,
          ...metadata
        });
      }

      if (res.data.success) {
        await fetchComplaints(); // Refresh list
        await fetchAnalytics(); // Refresh stats
        addToast(`Status updated to ${newStatus}`, 'success');
        return res.data.data;
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update status', 'error');
      throw err;
    }
  };

  const resolveComplaint = (id) => {
    updateComplaintStatus(id, 'Resolved', { 
      text: 'Citizen confirmed resolution. Complaint closed.'
    });
  };

  const confirmComplaintResolution = async (id) => {
    try {
      const complaint = complaints.find(c =>
        String(c.id).trim().toLowerCase() === String(id).trim().toLowerCase() ||
        String(c._id).trim().toLowerCase() === String(id).trim().toLowerCase() ||
        String(c.trackingId).trim().toLowerCase() === String(id).trim().toLowerCase()
      );
      
      if (!complaint) {
        addToast('Complaint not found', 'error');
        return false;
      }

      if (complaint.status !== 'Awaiting Citizen Confirmation') {
        addToast(`Cannot confirm. Status is "${complaint.status}", expected "Awaiting Citizen Confirmation"`, 'error');
        return false;
      }

      const mongoId = complaint._id;

      console.log('[CONFIRM RESOLUTION] complaint._id:', mongoId);
      console.log('[CONFIRM RESOLUTION] trackingId:', complaint.trackingId);
      console.log('[CONFIRM RESOLUTION] request URL:', `/complaints/${mongoId}/confirm`);
      console.log('[CONFIRM RESOLUTION] request body:', {});

      const res = await api.put(`/complaints/${mongoId}/confirm`);

      if (res.data.success) {
        await fetchComplaints(); // Refresh list
        await fetchAnalytics(); // Refresh stats
        addToast('Resolution confirmed successfully!', 'success');
        return true;
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to confirm resolution', 'error');
      return false;
    }
  };

  const reopenComplaint = (id, notes) => {
    updateComplaintStatus(id, 'Pending', { // Map Reopened to Pending in backend enum
      text: `Citizen requested rework: ${notes}`
    });
  };

  const checkDuplicate = (category, lat, lng, title = '') => {
    const similar = complaints.find(c => c.category === category && c.status !== 'Resolved');
    if (similar) {
      let confidence = 75;
      if (title && similar.title.toLowerCase().includes(title.toLowerCase().split(' ')[0])) confidence += 20;
      return { duplicate: true, complaint: similar, confidence: Math.min(confidence, 98) };
    }
    return null;
  };

  const value = {
    complaints: complaints.map(c => ({
      ...c,
      id: c.trackingId || c.id, // Ensure id is always set to trackingId for UI
      date: c.date || (c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : ''),
      image: c.image?.url || c.image,
      afterImage: c.afterImage?.url || c.afterImage,
      updates: c.timeline?.map(t => ({
        date: new Date(t.updatedAt).toLocaleString(),
        text: t.message
      })) || c.updates || []
    })),
    loading,
    toasts,
    addToast,
    removeToast,
    submitComplaint,
    updateComplaintStatus,
    resolveComplaint,
    confirmComplaintResolution,
    reopenComplaint,
    checkDuplicate,
    analytics,
    refreshComplaints: () => {
      fetchComplaints();
      fetchAnalytics();
    }
  };

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  );
};
