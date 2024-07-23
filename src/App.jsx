// WITH SOCIAL MEDIA SHARE FUNCTIONALITIES

import React, { useState, useEffect } from 'react';
import './App.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = 'en-US';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(null);
  const [editedNote, setEditedNote] = useState('');

  useEffect(() => {
    handleListen();
  }, [isListening]);

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log('continue..');
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log('Stopped Mic on Click');
      };
    }
    mic.onstart = () => {
      console.log('Mics on');
    };

    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      console.log(transcript);
      setNote(transcript);
      mic.onerror = event => {
        console.log(event.error);
      };
    };
  };

  const handleSaveNote = () => {
    if (isEditing) {
      const updatedNotes = savedNotes.map((savedNote, index) =>
        index === currentNoteIndex ? editedNote : savedNote
      );
      setSavedNotes(updatedNotes);
      setIsEditing(false);
      setCurrentNoteIndex(null);
      setEditedNote('');
    } else {
      setSavedNotes([...savedNotes, note]);
      setNote('');
    }
  };

  const handleEditNote = index => {
    setCurrentNoteIndex(index);
    setIsEditing(true);
    setEditedNote(savedNotes[index]);
  };

  const handleEditedNoteChange = event => {
    setEditedNote(event.target.value);
  };

  const shareNote = (note) => {
    // Encode note content for URLs
    const encodedNote = encodeURIComponent(note);

    // Email share
    const emailLink = `mailto:?subject=Check%20out%20my%20note&body=${encodedNote}`;
    // Twitter share
    const twitterLink = `https://twitter.com/intent/tweet?text=${encodedNote}`;
    // LinkedIn share
    const linkedinLink = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedNote}`;

    return { emailLink, twitterLink, linkedinLink };
  };

  return (
    <>
      <h1>Welcome to <span>Textify Voice</span></h1>
      <h4>Transform your voice into text effortlessly with TextifyVoice. This app allows you to record your speech, convert it into text, edit and save your notes, and share them via email or social media. Experience a seamless and user-friendly way to capture your thoughts on the go.</h4>

      <div className="container">
        <div className="box">
          <h2>Current Note</h2>
          <button onClick={() => setIsListening(prevState => !prevState)}>
            Start / Stop
          </button>
          <button onClick={handleSaveNote} disabled={!note && !isEditing}>
            {isEditing ? 'Update Note' : 'Save Note'}
          </button>
          <p>{note}</p>
        </div>
        <div className="box">
          <h2>Notes</h2>
          {savedNotes.map((savedNote, index) => (
            <div key={index} className="note">
              {isEditing && currentNoteIndex === index ? (
                <textarea
                  value={editedNote}
                  onChange={handleEditedNoteChange}
                  className="edit-input"
                />
              ) : (
                <p>{savedNote}</p>
              )}
              <button onClick={() => handleEditNote(index)}>
                {isEditing && currentNoteIndex === index ? 'Cancel' : 'Edit'}
              </button>
              <div className="share-buttons">
                <a href={shareNote(savedNote).emailLink} target="_blank" rel="noopener noreferrer">Share via Email</a>
                {/* <a href={shareNote(savedNote).facebookLink} target="_blank" rel="noopener noreferrer">Share on Facebook</a> */}
                <a href={shareNote(savedNote).twitterLink} target="_blank" rel="noopener noreferrer">Share on Twitter</a>
                <a href={shareNote(savedNote).linkedinLink} target="_blank" rel="noopener noreferrer">Share on LinkedIn</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
