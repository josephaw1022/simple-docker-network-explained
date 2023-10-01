'use client';
import React, { useState, useRef, KeyboardEvent } from 'react';

interface ResponseState {
  data: string | null;
  status: number | null;
  headers: string | null;
  error: string | null;
}

function Fetcher() {
  const [page, setPage] = useState<'ssr' | 'client'>('ssr');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseState, setResponseState] = useState<ResponseState>({
    data: null,
    status: null,
    headers: null,
    error: null,
  });

  const buttonRef = useRef<HTMLButtonElement | null>();

  const fetchURL = async () => {
    setResponseState({ data: null, status: null, headers: null, error: null });
    setIsLoading(true);

    try {
      if (page === 'ssr') {
        const res = await fetch('/api/express-api', {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: url,
          }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        const headers: Record<string, string> = {};
        res.headers.forEach((val, key) => {
          headers[key] = val;
        });

        setResponseState({
          data: JSON.stringify(data, null, 2),
          status: res.status,
          headers: JSON.stringify(headers, null, 2),
          error: null,
        });
      } else {
        const res = await fetch(url, {
          method: 'GET', // *GET, POST, PUT, DELETE, etc.
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        const headers: Record<string, string> = {};
        res.headers.forEach((val, key) => {
          headers[key] = val;
        });

        setResponseState({
          data: JSON.stringify(data, null, 2),
          status: res.status,
          headers: JSON.stringify(headers, null, 2),
          error: null,
        });
      }
    } catch (error: any) {
      setResponseState({
        data: null,
        status: null,
        headers: null,
        error: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      fetchURL();
      buttonRef?.current?.focus?.();
    }
  };

  const handlePageChange = (page: 'ssr' | 'client') => {
    setPage(page);
    setResponseState({ data: null, status: null, headers: null, error: null });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <nav className="w-full p-4 flex bg-blue-500 shadow-md text-white font-semibold">
        <h2 className=" text-2xl text-left  ">Url Fetcher</h2>

        <button
          onClick={() => handlePageChange('ssr')}
          className={
            (page === 'ssr' ? 'bg-red-300' : 'bg-blue-300') +
            ' w-56 rounded-lg p-2 mx-2 '
          }
        >
          Request in Container
        </button>
        <button
          onClick={() => handlePageChange('client')}
          className={
            (page === 'client' ? 'bg-red-300' : 'bg-blue-300') +
            ' w-56 rounded-lg p-2 mx-2  '
          }
        >
          Request in Browser
        </button>
      </nav>
      <div className="flex flex-col items-center justify-center p-4 h-full w-full mt-20">
        <div className="flex-1 flex flex-row justify-center items-center gap-4 lg:w-[500px] ">
          <input
            type="text"
            value={url}
            placeholder="Enter URL"
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-grow p-2 border rounded-l-md focus:outline-none focus:border-blue-500"
          />
          <button
            ref={buttonRef}
            onClick={fetchURL}
            className="px-4 py-2 text-white bg-blue-500 border rounded-r-md hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue"
          >
            Fetch
          </button>
        </div>
        <div className="mt-2">
          {isLoading ? <span className="text-blue-500">Loading...</span> : null}
        </div>
        <div className="w-full lg:w-[500px] my-2 border-b-2 ">
          {responseState.data ? (
            <>
              <span className="text-blue-500 font-semibold mb-4">Data:</span>
              <pre className="text-left bg-gray-100 rounded-md overflow-auto ">
                {responseState.data}
              </pre>
            </>
          ) : null}
        </div>
        <div className="w-full lg:w-[500px] my-2  border-b-2">
          {responseState.status ? (
            <>
              <span className="text-blue-500 font-semibold">Status: </span>
              <pre>{responseState.status}</pre>
            </>
          ) : null}
        </div>
        <div className="w-full lg:w-[500px] my-2">
          {responseState.headers ? (
            <>
              <span className="text-blue-500 font-semibold">Headers:</span>
              <pre className="text-left bg-gray-100 rounded-md overflow-auto ">
                {responseState.headers}
              </pre>
            </>
          ) : null}
        </div>
        <div className="w-full lg:w-[500px] mt-2 text-red-500">
          {responseState.error ? responseState.error : null}
        </div>
      </div>
    </div>
);
}

export default Fetcher;
