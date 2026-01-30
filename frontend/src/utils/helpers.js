import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const downloadPDF = async (elementId, filename) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    try {
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${filename}.pdf`);
    } catch (err) {
        console.error("PDF Download failed", err);
    }
};

export const downloadTextFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy:', err);
    }
};

export const getCourseLink = (title, platform) => {
    const query = encodeURIComponent(title + " free course " + platform);
    return `https://www.google.com/search?q=${query}`;
};

export const getJobLinks = (role, location) => {
    if (!role) role = 'Software Engineer';
    if (!location) location = 'India';

    // Clean params for URLs
    const q = encodeURIComponent(role);
    const l = encodeURIComponent(location);
    const qDash = role.trim().replace(/\s+/g, '-').toLowerCase();
    const lDash = location.trim().replace(/\s+/g, '-').toLowerCase();

    return [
        {
            platform: 'Naukri',
            url: `https://www.naukri.com/${qDash}-jobs-in-${lDash}`,
            color: 'blue',
            icon: 'Search'
        },
        {
            platform: 'LinkedIn',
            url: `https://www.linkedin.com/jobs/search/?keywords=${q}&location=${l}`,
            color: 'indigo',
            icon: 'Linkedin'
        },
        {
            platform: 'Indeed',
            url: `https://in.indeed.com/jobs?q=${q}&l=${l}`,
            color: 'emerald',
            icon: 'Search'
        }
    ];
};
