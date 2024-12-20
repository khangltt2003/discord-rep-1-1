const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-indigo-400 h-full flex justify-center items-center">
      {children}
    </div>
  );
};

export default AuthLayout;
