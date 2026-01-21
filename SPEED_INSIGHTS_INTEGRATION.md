# Speed Insights Integration Guide

This document describes how Vercel Speed Insights has been integrated into the Education Bliss AI Agent web application.

## What is Vercel Speed Insights?

Vercel Speed Insights is a performance monitoring tool that helps you understand how your web application performs in production. It tracks real-user metrics like Web Vitals and provides insights to improve your site's performance.

## Integration Steps

### 1. **Package Installation**

The `@vercel/speed-insights` package has been added to the project dependencies in `package.json`:

```json
{
  "dependencies": {
    "@vercel/speed-insights": "^1.0.0",
    "next": "^14.0.0",
    ...
  }
}
```

### 2. **SpeedInsights Component Integration**

The `SpeedInsights` component from `@vercel/speed-insights/next` has been added to the root layout (`app/layout.tsx`):

```tsx
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

The `SpeedInsights` component:
- Is placed at the end of the `<body>` tag
- Automatically injects the tracking script
- Requires no additional configuration
- Works seamlessly with Next.js 13+ App Router

### 3. **Project Structure**

```
.
├── app/
│   ├── layout.tsx          # Root layout with SpeedInsights
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── package.json            # Dependencies including @vercel/speed-insights
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── .gitignore              # Git ignore rules
```

## Features Enabled

By integrating Speed Insights, the following features are now available:

1. **Real User Monitoring (RUM)**: Collects performance metrics from actual users visiting the site
2. **Web Vitals Tracking**: Monitors Core Web Vitals metrics (LCP, FID, CLS, etc.)
3. **Performance Dashboard**: View performance data in the Vercel dashboard
4. **Historical Data**: Track performance trends over time
5. **Route-specific Insights**: See which routes have performance issues

## Deployment Instructions

To enable Speed Insights:

1. **Deploy to Vercel**: Use the Vercel CLI or connect your Git repository
   ```bash
   vercel deploy
   ```

2. **Enable Speed Insights in Dashboard**:
   - Go to your Vercel project dashboard
   - Navigate to the **Speed Insights** tab
   - Click **Enable**

3. **Monitor Performance**: After deployment and once users visit your site, metrics will appear in the Speed Insights dashboard

## Next Steps

1. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Deploy to Vercel:
   ```bash
   vercel deploy
   ```

## Configuration Options

For advanced use cases, you can customize Speed Insights behavior. See the [Speed Insights documentation](https://vercel.com/docs/speed-insights) for more details.

### Optional: Custom Data Filtering (Astro/HTML)

If you need to remove sensitive information from URLs, you can implement a `speedInsightsBeforeSend` function (for Astro or HTML implementations). However, for Next.js, the component handles this automatically.

## Learn More

- [Vercel Speed Insights Documentation](https://vercel.com/docs/speed-insights)
- [Web Vitals Guide](https://web.dev/vitals/)
- [Core Web Vitals Metrics](https://web.dev/vitals/#core-web-vitals)

## Troubleshooting

If Speed Insights data is not appearing:

1. Ensure the app is deployed to Vercel
2. Verify Speed Insights is enabled in the project dashboard
3. Wait a few minutes for initial data collection
4. Check browser console for any errors (should be none)
5. Verify the `/_vercel/speed-insights/script.js` is being loaded

## Files Modified/Created

- **Created**: `app/layout.tsx` - Root layout with SpeedInsights component
- **Created**: `app/page.tsx` - Home page
- **Created**: `app/globals.css` - Global styles
- **Created**: `package.json` - Project configuration with dependencies
- **Created**: `next.config.js` - Next.js configuration
- **Created**: `tsconfig.json` - TypeScript configuration
- **Created**: `.gitignore` - Git ignore rules
