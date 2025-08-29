import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content={process.env.NEXT_PUBLIC_SEO_DESCRIPTION} />
        <meta name="keywords" content="database, product, bootstrapped, profitable" />
        <meta name="author" content={process.env.NEXT_PUBLIC_PROJECTNAME} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta property="og:title" content={process.env.NEXT_PUBLIC_SEO_TITLE} />
        <meta property="og:description" content={process.env.NEXT_PUBLIC_SEO_DESCRIPTION} />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/og-image.jpg`} />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_FRONTEND_URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={process.env.NEXT_PUBLIC_TWITTER_NAME} />

        {/* Rewardful JavaScript Snippet */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`,
          }}
        />
        <script async src="https://r.wdfl.co/rw.js" data-rewardful="d16cb7"></script>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XKYR8S118E"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XKYR8S118E');
          `,
          }}
        />

        {/* Hotjar Tracking Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:5128809,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
