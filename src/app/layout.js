import "./globals.css"
import AuthProvider from "./components/SessionProvider";
import NavBar from "./components/NavBar"
import { SidebarProvider } from "./components/SidebarContext";

export default function RootLayout({ children, Session }) {

  return (
    <html lang="en">
      <body>
        <AuthProvider session={Session}>
          <SidebarProvider>
            <div className="pt-16">
              <NavBar />
              {children}
            </div>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
