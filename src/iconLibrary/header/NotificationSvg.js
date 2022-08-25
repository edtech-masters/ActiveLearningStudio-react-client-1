/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React from 'react';

const NotificationSvg = ({ primaryColor }) => (
  <>
    <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.7509 6.40096C14.7509 4.96854 14.1976 3.59478 13.2129 2.5819C12.2282 1.56903 10.8926 1 9.49993 1C8.1073 1 6.7717 1.56903 5.78696 2.5819C4.80222 3.59478 4.249 4.96854 4.249 6.40096C4.249 12.7021 1.62354 14.5024 1.62354 14.5024H17.3763C17.3763 14.5024 14.7509 12.7021 14.7509 6.40096Z"
        stroke={primaryColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.0139 18.103C10.86 18.3758 10.6392 18.6022 10.3735 18.7597C10.1077 18.9171 9.80649 18.9999 9.49986 18.9999C9.19322 18.9999 8.89197 18.9171 8.62626 18.7597C8.36054 18.6022 8.1397 18.3758 7.98584 18.103"
        stroke={primaryColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </>
);

export default NotificationSvg;
