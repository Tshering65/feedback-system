import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the default styles

import axios from '../axiosConfig';
import './FeedbackForm.css';

const FeedbackForm = () => {
  const [service_type, setServiceType] = useState('');
  const [emoji_feedback, setEmojiFeedback] = useState('');
  const [text_feedback, setTextFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleEmojiClick = (selectedEmoji) => {
    setEmojiFeedback(selectedEmoji);
    if (selectedEmoji === 'bad' || selectedEmoji === 'unsatisfactory') {
      setTextFeedback(''); // Allow text feedback for these emojis
    } else {
      setTextFeedback(''); // Reset text feedback for other emojis
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emoji_feedback || !service_type) {
      toast.error('Please provide both service type and emoji feedback.'); // Error toast
      return;
    }
  
    try {
      const response = await axios.post('/feedback', {  // Ensure the endpoint is '/feedback'
        service_type,
        emoji_feedback,
        text_feedback,
        email
      });
      toast.success('Feedback submitted successfully!'); // Success toast
      setServiceType('');
      setEmojiFeedback('');
      setTextFeedback('');
      setEmail('');
    } catch (error) {
      toast.error('Error submitting feedback.'); // Error toast
      console.error('Error details:', error.response ? error.response.data : error.message);
    }
  };
  

  return (
    <div className="feedback-form-container">
      <h1>Feedback Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Service Type:</label>
          <select value={service_type} onChange={(e) => setServiceType(e.target.value)} required>
            <option value="">Select a service</option>
            <option value="pension">Pension Service</option>
            <option value="real-estate">Real Estate Service</option>
            <option value="loan">Loan Service</option>
          </select>
        </div>
        <div>
          <label>Emoji Feedback:</label>
          <div className="emoji-container">
            <button
              className={emoji_feedback === 'happy' ? 'selected' : ''}
              onClick={() => handleEmojiClick('happy')}
              type="button"
            >
              😊
            </button>
            <button
              className={emoji_feedback === 'satisfactory' ? 'selected' : ''}
              onClick={() => handleEmojiClick('satisfactory')}
              type="button"
            >
              🙂 
            </button>
            <button
              className={emoji_feedback === 'unsatisfactory' ? 'selected' : ''}
              onClick={() => handleEmojiClick('unsatisfactory')}
              type="button"
            >
              😕
            </button>
            <button
              className={emoji_feedback === 'bad' ? 'selected' : ''}
              onClick={() => handleEmojiClick('bad')}
              type="button"
            >
              😠
            </button>
          </div>
        </div>
        {(emoji_feedback === 'unsatisfactory' || emoji_feedback === 'bad') && (
          <div>
            <label>Feedback:</label>
            <textarea
              value={text_feedback}
              onChange={(e) => setTextFeedback(e.target.value)}
              maxLength={300}
              required
            />
          </div>
        )}
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      <ToastContainer /> {/* Add this to render toast notifications */}
    </div>
  );
  
};

export default FeedbackForm;
