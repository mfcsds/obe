"use client";

import { Amplify } from 'aws-amplify';
import React, { ReactNode } from 'react';

// Configuration moved to useEffect to ensure client-side execution

export default function AmplifyProvider({ children }: { children: ReactNode }) {
    React.useEffect(() => {
        console.log('Configuring Amplify...');
        Amplify.configure({
            Auth: {
                Cognito: {
                    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
                    userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
                }
            },
            Storage: {
                S3: {
                    bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME || '',
                    region: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-southeast-3',
                }
            },
            API: {
                GraphQL: {
                    endpoint: process.env.NEXT_PUBLIC_APPSYNC_API_URL || '',
                    region: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-southeast-3',
                    defaultAuthMode: 'userPool'
                }
            }
        });
    }, []);

    return <>{children}</>;
}
