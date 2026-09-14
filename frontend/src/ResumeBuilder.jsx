import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';

function ResumeBuilder() {
  const [details, setDetails] = useState({
    name: '', location: '', email: '', phone: '', linkedin: '', github: '',
    summary: '', education: '', skills: '', projects: '', interests: '', certifications: '', experience: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(1);
  const [saveStatus, setSaveStatus] = useState('');

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const enhanceWithAI = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('https://resume-builder-app-dzu3.onrender.com/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          summary: details.summary,
          education: details.education,
          skills: details.skills,
          projects: details.projects,
          interests: details.interests,
          certifications: details.certifications,
          experience: details.experience
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const text = data.aiText;
        
        const extract = (tag) => {
          const regex = new RegExp(`\\[${tag}_START\\]([\\s\\S]*?)\\[${tag}_END\\]`);
          const match = text.match(regex);
          return match ? match[1].trim() : '';
        };

        setDetails(prev => ({
          ...prev,
          summary: extract('SUMMARY') || prev.summary,
          education: extract('EDUCATION') || prev.education,
          skills: extract('SKILLS') || prev.skills,
          projects: extract('PROJECTS') || prev.projects,
          interests: extract('INTERESTS') || prev.interests,
          certifications: extract('CERTIFICATIONS') || prev.certifications,
          experience: extract('EXPERIENCE') || prev.experience
        }));
      } else {
        alert("AI Enhancement failed: " + data.message);
      }
    } catch (error) {
      alert("Error connecting to Backend Server! Is it running?");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToDatabase = async () => {
    if (!details.name) {
      alert("Please enter your name before saving!");
      return;
    }
    setSaveStatus('Saving...');
    try {
      const response = await fetch('https://resume-builder-app-dzu3.onrender.com/api/save-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });
      const data = await response.json();
      if (data.success) {
        setSaveStatus('✅ Saved to Database!');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (error) {
      setSaveStatus('❌ Save Failed');
    }
  };

  const downloadPDF = () => {
    const element = document.getElementById('resume-preview');
    const opt = {
      margin: 10, filename: `${details.name || 'Resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  // 🔥 TEMPLATES STYLING (Updated Link Styles)
  const templates = {
    1: { wrapper: { fontFamily: '"Times New Roman", Times, serif', padding: '15mm 20mm', backgroundColor: 'white', color: 'black' }, header: { textAlign: 'center', marginBottom: '20px' }, name: { margin: '0', fontSize: '22px', fontWeight: 'bold', textTransform: 'uppercase' }, contact: { margin: '5px 0 2px 0', fontSize: '12px', color: '#333' }, link: { color: '#0056b3', textDecoration: 'none', fontWeight: 'bold' }, sectionTitle: { fontSize: '13px', fontWeight: 'bold', borderBottom: '1px solid black', paddingBottom: '3px', margin: '0 0 8px 0', textTransform: 'uppercase', color: '#000' }, text: { margin: '0', fontSize: '12px', whiteSpace: 'pre-line', lineHeight: '1.5' } },
    2: { wrapper: { fontFamily: 'Arial, sans-serif', padding: '0', backgroundColor: 'white', color: '#333' }, header: { backgroundColor: '#800000', color: 'white', padding: '30px 20px', textAlign: 'left', marginBottom: '20px' }, name: { margin: '0', fontSize: '28px', fontWeight: 'bold', color: 'white', letterSpacing: '1px', textTransform: 'uppercase' }, contact: { margin: '8px 0 0 0', fontSize: '13px', color: '#f8d7da' }, link: { color: '#ffcc00', textDecoration: 'none', fontWeight: 'bold' }, contentPadding: { padding: '0 25px 20px 25px' }, sectionTitle: { fontSize: '14px', fontWeight: 'bold', color: '#800000', borderBottom: '2px solid #800000', paddingBottom: '4px', margin: '0 0 10px 0', textTransform: 'uppercase' }, text: { margin: '0', fontSize: '13px', whiteSpace: 'pre-line', lineHeight: '1.6', color: '#4a5568' } },
    3: { wrapper: { fontFamily: '"Segoe UI", Roboto, Helvetica, sans-serif', padding: '15mm 20mm', backgroundColor: 'white', color: '#2d3748' }, header: { textAlign: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '20px' }, name: { margin: '0', fontSize: '26px', fontWeight: '300', color: '#800000', letterSpacing: '2px', textTransform: 'uppercase' }, contact: { margin: '10px 0 0 0', fontSize: '12px', color: '#718096' }, link: { color: '#800000', textDecoration: 'none', fontWeight: 'bold' }, sectionTitle: { fontSize: '12px', fontWeight: 'bold', color: 'white', backgroundColor: '#800000', padding: '4px 8px', display: 'inline-block', margin: '0 0 10px 0', letterSpacing: '1px' }, text: { margin: '0', fontSize: '12px', whiteSpace: 'pre-line', lineHeight: '1.7' } }
  };

  const currentTpl = templates[activeTemplate];

  // Helper function to format links
  const formatLink = (url) => {
    if (!url) return '';
    return url.includes('http') ? url : `https://${url}`;
  };

  return (
    <div style={{ fontFamily: '"Inter", sans-serif', padding: '20px', backgroundColor: '#fdfbfb', minHeight: '100vh' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <button onClick={() => setActiveTemplate(1)} style={activeTemplate === 1 ? activeBtn : inactiveBtn}>Classic Form (Image Style)</button>
          <button onClick={() => setActiveTemplate(2)} style={activeTemplate === 2 ? activeBtn : inactiveBtn}>Modern Maroon</button>
          <button onClick={() => setActiveTemplate(3)} style={activeTemplate === 3 ? activeBtn : inactiveBtn}>Elegant Minimal</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* LEFT SIDE: EDITOR */}
        <div style={{ flex: '1', minWidth: '350px', padding: '25px', backgroundColor: '#fff', borderRadius: '12px', maxHeight: '85vh', overflowY: 'auto', border: '1px solid #eee', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ backgroundColor: '#fff0f0', borderLeft: '4px solid #800000', padding: '10px', marginBottom: '20px', fontSize: '13px', color: '#800000' }}>
            💡 <strong>Pro Tip:</strong> Just type raw keywords and click the AI Magic button to auto-format!
          </div>
          
          <input type="text" name="name" value={details.name} onChange={handleChange} placeholder="Full Name" style={inputStyle} />
          <input type="text" name="location" value={details.location} onChange={handleChange} placeholder="Location" style={inputStyle} />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="email" name="email" value={details.email} onChange={handleChange} placeholder="Email" style={inputStyle} />
            <input type="text" name="phone" value={details.phone} onChange={handleChange} placeholder="Phone" style={inputStyle} />
          </div>

          {/* 🔥 New Inputs for LinkedIn and GitHub */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="text" name="linkedin" value={details.linkedin} onChange={handleChange} placeholder="LinkedIn (e.g. linkedin.com/in/manoj)" style={inputStyle} />
            <input type="text" name="github" value={details.github} onChange={handleChange} placeholder="GitHub (e.g. github.com/manoj)" style={inputStyle} />
          </div>

          <label style={labelStyle}>Profile Summary:</label>
          <textarea name="summary" value={details.summary} onChange={handleChange} placeholder="E.g., fresher looking for software job..." style={textAreaStyle} />
          <label style={labelStyle}>Education:</label>
          <textarea name="education" value={details.education} onChange={handleChange} placeholder="E.g., BE ECE 8.0 CGPA, 12th CS 75%..." style={{...textAreaStyle, height: '60px'}} />
          <label style={labelStyle}>Skills:</label>
          <textarea name="skills" value={details.skills} onChange={handleChange} placeholder="E.g., python, teamwork, tamil..." style={{...textAreaStyle, height: '60px'}} />
          <label style={labelStyle}>Projects:</label>
          <textarea name="projects" value={details.projects} onChange={handleChange} placeholder="E.g., IoT automatic door system..." style={{...textAreaStyle, height: '60px'}} />
          
          <label style={labelStyle}>Area of Interest:</label>
          <textarea name="interests" value={details.interests} onChange={handleChange} placeholder="E.g., power systems, marketing..." style={{...textAreaStyle, height: '50px'}} />
          
          <label style={labelStyle}>Certifications Earned:</label>
          <textarea name="certifications" value={details.certifications} onChange={handleChange} placeholder="E.g., NPTEL cyber security..." style={{...textAreaStyle, height: '50px'}} />
          
          <label style={labelStyle}>Experience / Internship:</label>
          <textarea name="experience" value={details.experience} onChange={handleChange} placeholder="E.g., CIFER Internship..." style={{...textAreaStyle, height: '50px'}} />

          <button onClick={enhanceWithAI} disabled={isGenerating} style={aiButtonStyle}>
            {isGenerating ? "⏳ AI is organizing your resume..." : "✨ AI Magic: Expand Keywords"}
          </button>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button onClick={saveToDatabase} style={dbButtonStyle}>💾 Save to DB</button>
            <button onClick={downloadPDF} style={buttonStyle}>📄 Download PDF</button>
          </div>
          {saveStatus && <p style={{ textAlign: 'center', fontSize: '13px', color: '#28a745', marginTop: '10px', fontWeight: 'bold' }}>{saveStatus}</p>}
        </div>

        {/* RIGHT SIDE: RESUME PREVIEW */}
        <div style={{ flex: '1.5', minWidth: '500px', display: 'flex', justifyContent: 'center' }}>
          <div id="resume-preview" style={{ ...resumeBaseStyle, ...currentTpl.wrapper }}>
            <div style={currentTpl.header}>
              <h2 style={currentTpl.name}>{details.name || "YOUR NAME"}</h2>
              
              <p style={currentTpl.contact}>{details.location || "Location"} | {details.email || "Email"} | {details.phone || "Phone"}</p>
              
              {/* 🔥 LINKEDIN & GITHUB PREVIEW SECTION */}
              {(details.linkedin || details.github) && (
                <p style={{ margin: '4px 0 0 0', fontSize: currentTpl.contact.fontSize }}>
                  {details.linkedin && (
                    <a href={formatLink(details.linkedin)} style={currentTpl.link} target="_blank" rel="noopener noreferrer">
                      {details.linkedin.replace('https://', '').replace('www.', '')}
                    </a>
                  )}
                  
                  {details.linkedin && details.github && (
                    <span style={{ margin: '0 8px', color: currentTpl.contact.color }}>|</span>
                  )}
                  
                  {details.github && (
                    <a href={formatLink(details.github)} style={currentTpl.link} target="_blank" rel="noopener noreferrer">
                      {details.github.replace('https://', '').replace('www.', '')}
                    </a>
                  )}
                </p>
              )}
            </div>
            
            <div style={currentTpl.contentPadding || {}}>
              {['SUMMARY', 'EDUCATION', 'SKILLS', 'PROJECTS', 'AREA OF INTEREST', 'CERTIFICATIONS EARNED', 'EXPERIENCE'].map((section, index) => {
                
                let detailKey = section.toLowerCase();
                if (section === 'AREA OF INTEREST') detailKey = 'interests';
                if (section === 'CERTIFICATIONS EARNED') detailKey = 'certifications';
                
                if (!details[detailKey]) return null;
                
                return (
                  <div key={index} style={{ marginBottom: '12px' }}>
                    <h4 style={currentTpl.sectionTitle}>{section}</h4>
                    <p style={currentTpl.text}>{details[detailKey]}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box', fontFamily: 'inherit' };
const textAreaStyle = { width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ddd', height: '60px', boxSizing: 'border-box', fontFamily: 'inherit' };
const labelStyle = { fontSize: '13px', fontWeight: '600', marginBottom: '6px', display: 'block', color: '#555' };
const aiButtonStyle = { width: '100%', padding: '12px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px', transition: '0.2s', boxShadow: '0 4px 10px rgba(111, 66, 193, 0.3)' };
const buttonStyle = { flex: 1, padding: '12px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const dbButtonStyle = { flex: 1, padding: '12px', backgroundColor: '#198754', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const activeBtn = { padding: '8px 20px', backgroundColor: '#800000', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' };
const inactiveBtn = { padding: '8px 20px', backgroundColor: '#fff', color: '#555', border: '1px solid #ccc', borderRadius: '20px', cursor: 'pointer' };
const resumeBaseStyle = { width: '210mm', minHeight: '297mm', boxSizing: 'border-box', boxShadow: '0 0 20px rgba(0,0,0,0.08)' };

export default ResumeBuilder;