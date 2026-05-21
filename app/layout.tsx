const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html className="en">
      <body className="font-poppins antialiased">{children}</body>
    </html>
  );
};

export default RootLayout;