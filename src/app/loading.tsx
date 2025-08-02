"use client";
import React from 'react';
import { Bars } from 'react-loader-spinner';

export default function Loading() {
    return (
        <div className='w-full h-screen flex items-center justify-center'>
            <Bars height="50" width="50" color="primary" ariaLabel="bars-loading" visible={true} />
        </div>
    )
}