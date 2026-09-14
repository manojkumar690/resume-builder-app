import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ResumeBuilder from './ResumeBuilder';

function Home() {
  return (
    <div style={{ fontFamily: '"Inter", "Segoe UI", sans-serif', color: '#333', backgroundColor: '#ffffff' }}>
      
      {/* 🚀 Hero Section (Maroon Theme) */}
      <div style={{ backgroundColor: '#800000', color: 'white', padding: '120px 20px', textAlign: 'center', borderBottom: '8px solid #5a0000' }}>
        <div style={{ display: 'inline-block', padding: '6px 16px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', color: '#f8f9fa', marginBottom: '20px', letterSpacing: '1px', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.3)' }}>
          Professional Resume Builder
        </div>
        
        <h1 style={{ fontSize: '54px', fontWeight: '800', margin: '0 0 20px 0', lineHeight: '1.2', letterSpacing: '-1px' }}>
          Craft Your Future with <br/><span style={{ color: '#ffb3b3' }}>AI-Powered Precision.</span>
        </h1>
        
        <p style={{ fontSize: '19px', color: '#f8f9fa', margin: '0 auto 40px auto', lineHeight: '1.7', maxWidth: '650px', opacity: '0.9' }}>
          Build a strictly professional, ATS-friendly resume in minutes. Let our intelligent backend engine write the perfect corporate bullet points for your next big interview.
        </p>
        
        <Link to="/builder" style={{ textDecoration: 'none' }}>
          <button style={{ padding: '16px 45px', fontSize: '18px', backgroundColor: '#ffffff', color: '#800000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)' }}>
            Create My Resume ➔
          </button>
        </Link>
      </div>

      {/* 🌟 Features Section */}
      <div style={{ padding: '100px 20px', backgroundColor: '#ffffff', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', color: '#800000', marginBottom: '60px', fontWeight: '800' }}>Built for the Modern Professional</h2>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', flexWrap: 'wrap', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={featureCardStyle}>
            <div style={iconContainerStyle}>🧠</div>
            <h3 style={featureTitleStyle}>AI Backend Integration</h3>
            <p style={featureDescStyle}>Our smart Node.js backend connects with AI to transform your basic project details into high-impact corporate sentences.</p>
          </div>
          
          <div style={featureCardStyle}>
            <div style={iconContainerStyle}>☁️</div>
            <h3 style={featureTitleStyle}>Cloud Storage Sync</h3>
            <p style={featureDescStyle}>Your data is securely saved in our MongoDB database, allowing you to edit and download your resume anytime.</p>
          </div>
          
          <div style={featureCardStyle}>
            <div style={iconContainerStyle}>📄</div>
            <h3 style={featureTitleStyle}>One-Click Export</h3>
            <p style={featureDescStyle}>Download your flawlessly formatted resume as a PDF instantly. No watermarks, no hidden fees.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// === 🌐 MAIN APP WRAPPER (Navbar & Footer) ===
function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: '"Inter", "Segoe UI", sans-serif' }}>
        
        <nav style={{ padding: '20px 60px', backgroundColor: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '0', zIndex: '100', borderBottom: '2px solid #800000', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2 style={{ color: '#800000', margin: 0, fontWeight: '800', fontSize: '24px', letterSpacing: '-0.5px' }}>
              Resume<span style={{ color: '#333' }}>Craft</span>
            </h2>
          </Link>
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            <Link to="/" style={linkStyle}>Home</Link>
            <Link to="/builder" style={linkStyle}>Templates</Link>
            <Link to="/builder">
              <button style={{ padding: '10px 24px', backgroundColor: '#800000', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                Dashboard
              </button>
            </Link>
          </div>
        </nav>

        <div style={{ flex: '1' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/builder" element={<ResumeBuilder />} />
          </Routes>
        </div>
        
        <footer style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f8f9fa', color: '#555', borderTop: '1px solid #eee', fontSize: '14px' }}>
          <p style={{ margin: '0 0 8px 0' }}>© 2026 ResumeCraft. Full-Stack Web Application.</p>
          <p style={{ margin: '0', fontWeight: '600', color: '#800000' }}>Developed by Manoj Kumar C</p>
        </footer>

      </div>
    </BrowserRouter>
  );
}

const linkStyle = { color: '#333', textDecoration: 'none', fontSize: '15px', fontWeight: '600' };
const featureCardStyle = { flex: '1', minWidth: '280px', backgroundColor: '#ffffff', padding: '40px 30px', borderRadius: '12px', border: '1px solid #eaeaea', textAlign: 'left', borderTop: '4px solid #800000', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' };
const iconContainerStyle = { display: 'inline-block', fontSize: '26px', backgroundColor: '#fff0f0', padding: '15px', borderRadius: '12px', marginBottom: '20px', color: '#800000' };
const featureTitleStyle = { fontSize: '20px', color: '#800000', marginBottom: '12px', marginTop: '0', fontWeight: '700' };
const featureDescStyle = { fontSize: '15px', color: '#555', lineHeight: '1.6', margin: '0' };

export default App;