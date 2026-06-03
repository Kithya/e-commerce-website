import { Toaster } from "react-hot-toast";
import "./globals.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html className="en">
      <body className="font-poppins antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              border: "1px solid #3b9c3c",
              padding: "16px",
              color: "#3b9c3c",
              fontWeight: "bold",
            },
          }}
        />
      </body>
    </html>
  );
};

export default RootLayout;
