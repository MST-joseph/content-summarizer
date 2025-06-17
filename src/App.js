import React from 'react';
import { useAuth } from "react-oidc-context";
import SafetyContentSummarizer from './components/SafetyContentSummarizer';
import './App.css';

function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "od1ca3on738fo0onip41qev8o";
    const logoutUri = "https://main.d2cnyyr1gulo6q.amplifyapp.com";
    const cognitoDomain = "https://ap-northeast-2skxje5knv.auth.ap-northeast-2.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return (
      <div className="App" style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>로딩 중...</p>
        </div>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="App" style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
          <h3 style={{ color: '#e74c3c', marginBottom: '10px' }}>오류가 발생했습니다</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>{auth.error.message}</p>
        </div>
      </div>
    );
  }

  if (auth.isAuthenticated) {
    return (
      <div className="App">
        {/* 개선된 헤더 */}
        <header style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🛡️
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>콘텐츠 요약 시스템</h1>
                <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                  안녕하세요, {auth.user?.profile.email}님!
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => signOutRedirect()}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '10px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              로그아웃
            </button>
          </div>
        </header>
        
        {/* 기존 컴포넌트 */}
        <SafetyContentSummarizer />
      </div>
    );
  }

  // 개선된 로그인 페이지
  return (
    <div className="App" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '60px 40px',
        borderRadius: '20px',
        boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
      }}>
        {/* 로고 */}
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 30px',
          fontSize: '36px'
        }}>
          🛡️
        </div>
        
        {/* 제목 */}
        <h1 style={{ 
          color: '#2c3e50', 
          fontSize: '28px', 
          fontWeight: '700',
          marginBottom: '10px' 
        }}>
          콘텐츠 요약 시스템
        </h1>
        
        <p style={{ 
          color: '#7f8c8d', 
          fontSize: '16px', 
          marginBottom: '40px',
          lineHeight: '1.5'
        }}>
          AI 기반 자료 분석 및 요약 서비스를<br />
          이용하시려면 로그인해주세요.
        </p>
        
        {/* 로그인 버튼 */}
        <button 
          onClick={() => auth.signinRedirect()}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '50px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 12px 25px rgba(102, 126, 234, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)';
          }}
        >
          🔐 로그인하기
        </button>
        
        {/* 추가 정보 */}
        <p style={{ 
          color: '#95a5a6', 
          fontSize: '12px', 
          marginTop: '30px',
          lineHeight: '1.4'
        }}>
          계정이 없으시다면 가입 신청 후<br />
          관리자 승인을 받아주세요.
        </p>
      </div>
    </div>
  );
}

export default App;