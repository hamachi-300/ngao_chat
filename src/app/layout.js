import "./globals.css"
import AuthProvider from "./components/SessionProvider";

export default function RootLayout({ children, Session }) {

  return (
    <html lang="en">
      <body>
        <AuthProvider session={Session}>
            {children}
        </AuthProvider>
      </body>
    </html>
  );
}
