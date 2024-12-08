interface LoaderProps {
    isAdmin: boolean | null;
  }
  
  const Loader = ({ isAdmin }: LoaderProps) => {
    return (
      <div
        className={`flex ${
          isAdmin ? "h-[calc(100vh-144px)]" : "h-screen"
        } items-center justify-center bg-white`}
      >
        <div
          className={`h-16 w-16 animate-spin rounded-full border-4 border-solid ${
            isAdmin ? "border-red-600" : "border-primary"
          } border-t-transparent`}
        ></div>
      </div>
    );
  };
  
  export default Loader;
  