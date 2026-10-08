const FallbackComponent = ({ error }) => {
  return (
    <div role="alert">
      <h1>Something went wrong :(</h1>
      <pre style={{ color: 'red' }}>
        {error.message || 'Please make a bug report to sahaarnav3@gmail.com'}
      </pre>
    </div>
  );
};

export default FallbackComponent;
