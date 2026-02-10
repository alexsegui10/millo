// Safe division utility to prevent division by zero errors
export const safeDivide = (numerator: number, denominator: number, defaultValue: number = 0): number => {
    if (denominator === 0 || !isFinite(denominator)) {
        return defaultValue;
    }
    const result = numerator / denominator;
    return isFinite(result) ? result : defaultValue;
};

// Calculate save rate as percentage
export const calculateSaveRate = (saves: number, views: number): number => {
    return safeDivide(saves, views, 0) * 100;
};

// Calculate followers per 1k views
export const calculateFollowersPer1kViews = (followersGained: number, views: number): number => {
    return safeDivide(followersGained * 1000, views, 0);
};

// Calculate engagement rate
export const calculateEngagementRate = (likes: number, comments: number, saves: number, views: number): number => {
    const totalEngagement = likes + comments + saves;
    return safeDivide(totalEngagement, views, 0) * 100;
};

// Format number with K/M suffix
export const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

// Format percentage to 2 decimal places
export const formatPercentage = (value: number): string => {
    return value.toFixed(2) + '%';
};
