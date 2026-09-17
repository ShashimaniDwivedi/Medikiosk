import { useNavigate } from "react-router-dom";

function LanguageSelection() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/consent");
  };

  return (
    <div className="welcome-page">
      <div className="welcome-card">
        {/* Logo */}
        <div className="welcome-logo">🏥</div>

        {/* Brand */}
        <div className="brand-name">MediKiosk</div>

        <h1>Welcome to MediKiosk</h1>

        <p className="welcome-subtitle">
          Your smart and simple healthcare assistant
        </p>

        {/* Features */}
        <div className="welcome-features">
          <div className="feature">
            <div className="feature-icon">🩺</div>
            <div>
              <h3>Smart Health Assessment</h3>
              <p>Share your symptoms and health information easily.</p>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">🤖</div>
            <div>
              <h3>AI-Powered Interview</h3>
              <p>Get guided questions based on your health concerns.</p>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">🔒</div>
            <div>
              <h3>Secure & Private</h3>
              <p>Your healthcare information is handled securely.</p>
            </div>
          </div>
        </div>

        {/* Continue */}
        <button className="welcome-btn" onClick={handleContinue}>
          Get Started
          <span>→</span>
        </button>

        <p className="welcome-note">
          Please provide accurate information for a better assessment.
        </p>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .welcome-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 30px 20px;

          background:
            radial-gradient(circle at 15% 20%, rgba(52, 152, 219, 0.10), transparent 30%),
            radial-gradient(circle at 85% 80%, rgba(46, 204, 113, 0.09), transparent 30%),
            #f4f8fc;

          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .welcome-card {
          width: 100%;
          max-width: 620px;

          padding: 45px 48px;

          background: rgba(255, 255, 255, 0.96);

          border: 1px solid #e1eaf2;
          border-radius: 24px;

          box-shadow:
            0 20px 55px rgba(30, 64, 100, 0.10),
            0 4px 12px rgba(30, 64, 100, 0.04);

          text-align: center;
        }

        .welcome-logo {
          width: 76px;
          height: 76px;

          margin: 0 auto 14px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 22px;

          background: linear-gradient(135deg, #e9f5ff, #eefaf5);

          border: 1px solid #d9eaf5;

          font-size: 38px;

          box-shadow: 0 8px 20px rgba(41, 128, 185, 0.10);
        }

        .brand-name {
          margin-bottom: 7px;

          color: #1976b8;

          font-size: 15px;
          font-weight: 800;

          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .welcome-card h1 {
          margin: 0;

          color: #17324d;

          font-size: 32px;
          font-weight: 800;

          letter-spacing: -0.6px;
        }

        .welcome-subtitle {
          margin: 10px 0 30px;

          color: #71849a;

          font-size: 15px;
          line-height: 1.6;
        }

        .welcome-features {
          display: flex;
          flex-direction: column;
          gap: 12px;

          margin-bottom: 28px;

          text-align: left;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 15px;

          padding: 15px 17px;

          background: #f8fbfe;

          border: 1px solid #e5edf4;
          border-radius: 14px;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .feature:hover {
          transform: translateY(-2px);

          border-color: #cfe1ef;

          box-shadow: 0 7px 18px rgba(30, 64, 100, 0.07);
        }

        .feature-icon {
          flex-shrink: 0;

          width: 45px;
          height: 45px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;

          background: #eaf5fd;

          font-size: 21px;
        }

        .feature h3 {
          margin: 0 0 3px;

          color: #29435d;

          font-size: 14px;
          font-weight: 750;
        }

        .feature p {
          margin: 0;

          color: #7a8da1;

          font-size: 12.5px;
          line-height: 1.5;
        }

        .welcome-btn {
          width: 100%;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;

          padding: 15px 22px;

          border: none;
          border-radius: 12px;

          background: linear-gradient(135deg, #1976b8, #168a9b);

          color: white;

          font-size: 15px;
          font-weight: 750;

          cursor: pointer;

          box-shadow: 0 8px 18px rgba(25, 118, 184, 0.20);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .welcome-btn span {
          font-size: 19px;
          transition: transform 0.2s ease;
        }

        .welcome-btn:hover {
          transform: translateY(-2px);

          box-shadow: 0 12px 24px rgba(25, 118, 184, 0.25);
        }

        .welcome-btn:hover span {
          transform: translateX(4px);
        }

        .welcome-btn:active {
          transform: translateY(0);
        }

        .welcome-note {
          margin: 18px 0 0;

          color: #9aa9b8;

          font-size: 11px;
          line-height: 1.5;
        }

        @media (max-width: 600px) {
          .welcome-page {
            padding: 18px 14px;
          }

          .welcome-card {
            padding: 32px 22px;

            border-radius: 20px;
          }

          .welcome-logo {
            width: 68px;
            height: 68px;

            font-size: 33px;
          }

          .welcome-card h1 {
            font-size: 26px;
          }

          .welcome-subtitle {
            margin-bottom: 24px;
            font-size: 14px;
          }

          .feature {
            padding: 13px;
          }

          .feature-icon {
            width: 41px;
            height: 41px;
            font-size: 19px;
          }
        }
      `}</style>
    </div>
  );
}

export default LanguageSelection;
