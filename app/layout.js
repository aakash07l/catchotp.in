import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "CatchOtp.in - Virtual OTP & SMS Verification Service",
  description: "Rent premium virtual phone numbers to receive SMS and bypass verification codes instantly. Safe, secure, and fast.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
