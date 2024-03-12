import React from 'react';
import ScrollContainer from './scrollcontainer';

function Account() {
  return (
    <div className="container px-4 mx-auto">
      <h1 className="mt-8 text-3xl font-bold">Content Goes Here</h1>
      <ScrollContainer>
        {/* Your content goes here */}
        <div className="inline-block w-64 h-16 mr-4 bg-gray-200">Item 1</div>
        <div className="inline-block w-64 h-16 mr-4 bg-gray-200">Item 2</div>
        <div className="inline-block w-64 h-16 mr-4 bg-gray-200">Item 3</div>
        <div className="inline-block w-64 h-16 mr-4 bg-gray-200">Item 4</div>
        <div className="inline-block w-64 h-16 mr-4 bg-gray-200">Item 5</div>
        <div className="inline-block w-64 h-16 mr-4 bg-gray-200">Item 6</div>
        <div className="inline-block w-64 h-16 mr-4 bg-gray-200">Item 7</div>
        <div className="inline-block w-64 h-16 mr-4 bg-gray-200">Item 8</div>
        <div className="inline-block w-64 h-16 mr-4 bg-gray-200">Item 9</div>
        <div className="inline-block w-64 h-16 mr-4 bg-gray-200">Item 10</div>
      </ScrollContainer>
    </div>
  );
}

export default Account;
