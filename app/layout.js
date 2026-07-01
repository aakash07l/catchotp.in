import "./globals.css";

export const metadata = {
  title: "CatchOtp.in - Virtual OTP & SMS Verification Service",
  description: "Rent premium virtual phone numbers to receive SMS and bypass verification codes instantly. Safe, secure, and fast.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
