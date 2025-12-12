const Container = ({ children, className = '' }) => {
 return (
  <div className={`container-custom mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl ${className}`}>
   {children}
  </div>
 );
};

export default Container;

