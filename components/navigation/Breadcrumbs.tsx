"use client";

import { Breadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';

export default function DynamicBreadcrumbs() {
    const pathname = usePathname();
    const pathnames = pathname.split('/').filter((x) => x);

    return (
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Link
                component={NextLink}
                underline="hover"
                color="inherit"
                href="/"
            >
                Home
            </Link>
            {pathnames.map((value, index) => {
                const last = index === pathnames.length - 1;
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const title = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');

                return last ? (
                    <Typography color="text.primary" key={to}>
                        {title}
                    </Typography>
                ) : (
                    <Link
                        component={NextLink}
                        underline="hover"
                        color="inherit"
                        href={to}
                        key={to}
                    >
                        {title}
                    </Link>
                );
            })}
        </Breadcrumbs>
    );
}
