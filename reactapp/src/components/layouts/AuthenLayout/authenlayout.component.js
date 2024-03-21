function AuthenLayout({ children }) {
  return (
    <div className="flex place-items-center">
      <div className="container justify-center mx-auto">
        <div>
          <h2 className="text-center font-customs2">Welcome</h2>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthenLayout;