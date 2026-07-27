import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReferAndEarnPageComponent from '../components/ReferAndEarnPage';

const ReferAndEarnPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return <ReferAndEarnPageComponent onBackToHome={handleBackToHome} />;
};

export default ReferAndEarnPage;
