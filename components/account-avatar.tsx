"use client";

import { FC } from 'react';

interface AccountAvatarProps {
  size: number;
  address?: string;
}

export const AccountAvatar: FC<AccountAvatarProps> = ({ size, address }) => {
  // You can customize this component to show a custom avatar
  // For now, we'll show a simple placeholder
  return (
    <div 
      style={{ 
        width: size, 
        height: size, 
        borderRadius: '50%',
        backgroundColor: '#E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size / 2,
        color: '#64748B',
        overflow: 'hidden'
      }}
    >
      {address ? address.slice(2, 4) : '??'}
    </div>
  );
}; 