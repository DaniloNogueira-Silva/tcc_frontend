'use client';

import { PropsWithChildren, useState } from 'react';

// Layout components
import React from 'react';
import { isWindowAvailable } from 'utils/navigation';

// Chakra imports


// Custom Chakra theme

interface AuthProps extends PropsWithChildren {}

export default function AuthLayout({ children }: AuthProps) {
  // states and functions
  if (isWindowAvailable()) document.documentElement.dir = 'ltr';
  return (
    <div>
      <div className="relative float-right h-full min-h-screen w-full dark:!bg-navy-900">
        <main className={`mx-auto min-h-screen`}>
          {children}
        </main>
      </div>
    </div>
  );
}
