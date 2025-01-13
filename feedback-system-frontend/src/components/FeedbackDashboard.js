import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import './FeedbackDashboard.css';

const FeedbackDashboard = () => {
  const [service, setService] = useState('');
  const [stats, setStats] = useState([]);  // Ensure stats is initialized as an array
  const [message, setMessage] = useState('');

  const fetchStats = async () => {
    try {
      const response = await axios.get(`/feedback/stats?service=${service}`);
      if (response.data.length === 0) {
        setMessage('No feedback has been given for this service.');
        setStats([]);
      } else {
        setMessage('');
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching feedback stats:', error);
      setMessage('Error fetching feedback stats.');
    }
  };

  useEffect(() => {
    if (service) {
      fetchStats();
    }
  }, [service]);

  return (
    <div className="feedback-dashboard-container">
      <h1>Feedback Dashboard</h1>
      <div>
        <label>Select Service:</label>
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
        >
          <option value="">Select a service</option>
          <option value="pension">Pension Service</option>
          <option value="real-estate">Real Estate Service</option>
          <option value="loan">Loan Service</option>
        </select>
      </div>

      {message && <p>{message}</p>}

      {stats.length > 0 && (
        <div>
          {stats.map((stat) => (
            <p key={stat._id}>
              {stat._id === 'happy' && '😊 Happy: '}{stat._id === 'satisfactory' && '🙂 Satisfactory: '}
              {stat._id === 'unsatisfactory' && '😕 Unsatisfactory: '}{stat._id === 'bad' && '😠 Bad: '}
              {stat.count}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackDashboard;
